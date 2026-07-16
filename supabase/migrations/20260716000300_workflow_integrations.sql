create policy analysis_insert on public.ai_analyses
for insert to authenticated
with check (
  exists (
    select 1 from public.service_requests request
    where request.id = request_id
      and request.customer_id = auth.uid()
      and request.status = 'draft'
  )
);

create or replace function public.save_workflow_translation(
  entity_kind text,
  entity_uuid uuid,
  source_lang text,
  target_lang text,
  original_value text,
  translated_value text,
  translation_state public.translation_status,
  provider_name text,
  model_name text default null
) returns public.workflow_translations
language plpgsql security definer set search_path = '' as $$
declare result public.workflow_translations; authorized boolean := false;
begin
  if entity_kind='service_request' then
    authorized := exists (
      select 1 from public.service_requests request
      where request.id = entity_uuid and request.customer_id = auth.uid()
    );
  elsif entity_kind='booking_status_event' then
    authorized := exists(
      select 1 from public.booking_status_events event join public.bookings booking on booking.id=event.booking_id
      where event.id=entity_uuid and (booking.customer_id=auth.uid() or booking.worker_id=public.current_worker_id() or public.is_admin())
    );
  end if;
  if source_lang not in ('en','fil') or target_lang not in ('en','fil') or not authorized then
    raise exception using errcode='P0001', message='AUTHORIZATION_DENIED';
  end if;

  insert into public.workflow_translations(
    entity_type, entity_id, source_language, target_language, original_text,
    translated_text, status, provider, model
  ) values (
    entity_kind, entity_uuid, source_lang, target_lang, original_value,
    translated_value, translation_state, provider_name, model_name
  )
  on conflict(entity_type, entity_id, target_language) do update set
    original_text=excluded.original_text,
    translated_text=excluded.translated_text,
    status=excluded.status,
    provider=excluded.provider,
    model=excluded.model,
    created_at=now()
  returning * into result;
  return result;
end $$;

create or replace function public.get_booking_route_context(booking_uuid uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  select jsonb_build_object(
    'origin', jsonb_build_array(
      extensions.st_x(extensions.geometry(worker.base_location)),
      extensions.st_y(extensions.geometry(worker.base_location))
    ),
    'destination', jsonb_build_array(
      extensions.st_x(extensions.geometry(request.location)),
      extensions.st_y(extensions.geometry(request.location))
    )
  ) into result
  from public.bookings booking
  join public.worker_applications worker on worker.id=booking.worker_id
  join public.service_requests request on request.id=booking.request_id
  where booking.id=booking_uuid
    and (booking.customer_id=auth.uid() or booking.worker_id=public.current_worker_id() or public.is_admin())
    and worker.base_location is not null;

  if result is null then
    raise exception using errcode='P0001', message='ROUTE_UNAVAILABLE';
  end if;
  return result;
end $$;

create unique index one_worker_location_snapshot_per_booking
on public.route_snapshots(booking_id) where worker_location_snapshot;

create or replace function public.save_route_snapshot(
  booking_uuid uuid,
  origin_lon double precision,
  origin_lat double precision,
  destination_lon double precision,
  destination_lat double precision,
  distance_value integer,
  duration_value integer,
  route_geometry jsonb,
  provider_name text,
  route_state public.route_status,
  is_worker_snapshot boolean default false
) returns public.route_snapshots
language plpgsql security definer set search_path = '' as $$
declare booking_row public.bookings; result public.route_snapshots;
begin
  select * into booking_row from public.bookings where id=booking_uuid;
  if booking_row.id is null
    or (booking_row.customer_id<>auth.uid()
      and booking_row.worker_id is distinct from public.current_worker_id()
      and not public.is_admin()) then
    raise exception using errcode='P0001', message='AUTHORIZATION_DENIED';
  end if;
  if is_worker_snapshot and public.current_worker_id() is distinct from booking_row.worker_id and not public.is_admin() then
    raise exception using errcode='P0001', message='AUTHORIZATION_DENIED';
  end if;
  if distance_value < 0 or duration_value < 0 then
    raise exception using errcode='P0001', message='VALIDATION_FAILED';
  end if;

  insert into public.route_snapshots(
    booking_id, origin, destination, distance_meters, duration_seconds,
    geometry, provider, status, worker_location_snapshot
  ) values (
    booking_uuid,
    extensions.st_setsrid(extensions.st_makepoint(origin_lon,origin_lat),4326)::extensions.geography,
    extensions.st_setsrid(extensions.st_makepoint(destination_lon,destination_lat),4326)::extensions.geography,
    distance_value, duration_value, route_geometry, provider_name, route_state, is_worker_snapshot
  ) returning * into result;
  return result;
exception when unique_violation then
  select * into result from public.route_snapshots
  where booking_id=booking_uuid and worker_location_snapshot
  order by calculated_at desc limit 1;
  return result;
end $$;

create or replace function public.admin_override_booking(
  booking_uuid uuid,
  next_status public.booking_status,
  reason text
) returns public.bookings
language plpgsql security definer set search_path = '' as $$
declare before_row public.bookings; result public.bookings;
begin
  if not public.is_admin() or char_length(trim(reason)) < 3 then
    raise exception using errcode='P0001', message='AUTHORIZATION_DENIED';
  end if;
  select * into before_row from public.bookings where id=booking_uuid for update;
  if before_row.id is null then raise exception using errcode='P0001', message='VALIDATION_FAILED'; end if;
  update public.bookings set status=next_status,
    cancelled_reason=case when next_status='cancelled' then reason else cancelled_reason end
  where id=booking_uuid returning * into result;
  insert into public.booking_status_events(booking_id,from_status,to_status,actor_id,note_original,note_language)
  values(booking_uuid,before_row.status,next_status,auth.uid(),reason,'en');
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,reason,before_data,after_data)
  values(auth.uid(),'override_booking','booking',booking_uuid,reason,to_jsonb(before_row),to_jsonb(result));
  return result;
end $$;

grant execute on function public.save_workflow_translation(text,uuid,text,text,text,text,public.translation_status,text,text) to authenticated;
grant execute on function public.get_booking_route_context(uuid) to authenticated;
grant execute on function public.save_route_snapshot(uuid,double precision,double precision,double precision,double precision,integer,integer,jsonb,text,public.route_status,boolean) to authenticated;
grant execute on function public.admin_override_booking(uuid,public.booking_status,text) to authenticated;

create table public.notification_preferences(
  user_id uuid primary key references public.profiles on delete cascade,
  booking_alerts boolean not null default true,
  message_alerts boolean not null default false,
  promotions boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.notification_preferences enable row level security;
create policy notification_preferences_owner on public.notification_preferences
for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());

create or replace function public.admin_set_cash_status(
  cash_uuid uuid, next_status public.cash_status, reason text
) returns public.cash_records language plpgsql security definer set search_path='' as $$
declare before_row public.cash_records; result public.cash_records;
begin
  if not public.is_admin() or char_length(trim(reason))<3 then raise exception using errcode='P0001',message='AUTHORIZATION_DENIED'; end if;
  select * into before_row from public.cash_records where id=cash_uuid for update;
  update public.cash_records set status=next_status,
    confirmed_at=case when next_status='paid' then coalesce(confirmed_at,now()) else confirmed_at end,
    confirmed_by=case when next_status='paid' then coalesce(confirmed_by,auth.uid()) else confirmed_by end
  where id=cash_uuid returning * into result;
  if result.id is null then raise exception using errcode='P0001',message='VALIDATION_FAILED'; end if;
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,reason,before_data,after_data)
  values(auth.uid(),'set_cash_status','cash_record',cash_uuid,reason,to_jsonb(before_row),to_jsonb(result));
  return result;
end $$;

create or replace function public.admin_correct_service_price(
  service_uuid uuid, next_price_centavos integer, reason text
) returns public.worker_services language plpgsql security definer set search_path='' as $$
declare before_row public.worker_services; result public.worker_services;
begin
  if not public.is_admin() or next_price_centavos<0 or char_length(trim(reason))<3 then raise exception using errcode='P0001',message='AUTHORIZATION_DENIED'; end if;
  select * into before_row from public.worker_services where id=service_uuid for update;
  update public.worker_services set price_centavos=next_price_centavos where id=service_uuid returning * into result;
  if result.id is null then raise exception using errcode='P0001',message='VALIDATION_FAILED'; end if;
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,reason,before_data,after_data)
  values(auth.uid(),'correct_service_price','worker_service',service_uuid,reason,to_jsonb(before_row),to_jsonb(result));
  return result;
end $$;

grant execute on function public.admin_set_cash_status(uuid,public.cash_status,text) to authenticated;
grant execute on function public.admin_correct_service_price(uuid,integer,text) to authenticated;

create or replace function public.admin_set_category_active(category_uuid uuid, active boolean, reason text)
returns public.categories language plpgsql security definer set search_path='' as $$
declare before_row public.categories; result public.categories;
begin
  if not public.is_admin() or char_length(trim(reason))<3 then raise exception using errcode='P0001',message='AUTHORIZATION_DENIED'; end if;
  select * into before_row from public.categories where id=category_uuid for update;
  update public.categories set is_active=active where id=category_uuid returning * into result;
  if result.id is null then raise exception using errcode='P0001',message='VALIDATION_FAILED'; end if;
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,reason,before_data,after_data)
  values(auth.uid(),'set_category_active','category',category_uuid,reason,to_jsonb(before_row),to_jsonb(result));
  return result;
end $$;
grant execute on function public.admin_set_category_active(uuid,boolean,text) to authenticated;

create or replace function public.get_request_coordinates(request_uuid uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
  select jsonb_build_object('longitude',extensions.st_x(extensions.geometry(request.location)),'latitude',extensions.st_y(extensions.geometry(request.location))) into result
  from public.service_requests request where request.id=request_uuid and (request.customer_id=auth.uid() or request.assigned_worker_id=public.current_worker_id() or public.is_admin());
  if result is null then raise exception using errcode='P0001',message='AUTHORIZATION_DENIED'; end if;
  return result;
end $$;
grant execute on function public.get_request_coordinates(uuid) to authenticated;

create or replace function public.get_my_private_profile()
returns public.profiles language sql stable security definer set search_path='' as $$
  select * from public.profiles where id=auth.uid()
$$;
grant execute on function public.get_my_private_profile() to authenticated;

create or replace function public.get_booking_service_address(booking_uuid uuid)
returns text language plpgsql stable security definer set search_path='' as $$
declare result text;
begin
  select concat_ws(', ',nullif(address.street_number,''),address.street,nullif(address.district,''),address.city,address.region,nullif(address.postal_code,'')) into result
  from public.bookings booking join public.service_requests request on request.id=booking.request_id join public.addresses address on address.id=request.address_id
  where booking.id=booking_uuid and (booking.customer_id=auth.uid() or booking.worker_id=public.current_worker_id() or public.is_admin());
  if result is null then raise exception using errcode='P0001',message='AUTHORIZATION_DENIED'; end if;return result;
end $$;
grant execute on function public.get_booking_service_address(uuid) to authenticated;
