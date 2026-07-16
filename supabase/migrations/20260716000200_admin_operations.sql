create or replace function public.admin_review_worker(application_uuid uuid, decision public.worker_application_status, reason text)
returns public.worker_applications language plpgsql security definer set search_path = '' as $$
declare before_row public.worker_applications; result public.worker_applications;
begin
  if not public.is_admin() then raise exception using errcode='P0001', message='AUTHORIZATION_DENIED'; end if;
  if decision not in ('approved','rejected','suspended') or char_length(trim(reason)) < 3 then raise exception using errcode='P0001', message='VALIDATION_FAILED'; end if;
  select * into before_row from public.worker_applications where id=application_uuid for update;
  if decision='approved' and (not public.has_approved_id(before_row.user_id) or before_row.base_location is null or not exists(select 1 from public.worker_services where worker_id=application_uuid and price_centavos > 0)) then raise exception using errcode='P0001', message='WORKER_INELIGIBLE'; end if;
  update public.worker_applications set status=decision,rejection_reason=case when decision='approved' then null else reason end,reviewed_at=now(),reviewed_by=auth.uid() where id=application_uuid returning * into result;
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,reason,before_data,after_data) values(auth.uid(),'review_worker','worker_application',application_uuid,reason,to_jsonb(before_row),to_jsonb(result));
  return result;
end $$;

create or replace function public.admin_set_account_status(user_uuid uuid, next_status public.account_status, reason text)
returns public.profiles language plpgsql security definer set search_path = '' as $$
declare before_row public.profiles; result public.profiles;
begin
  if not public.is_admin() or char_length(trim(reason)) < 3 then raise exception using errcode='P0001', message='AUTHORIZATION_DENIED'; end if;
  select * into before_row from public.profiles where id=user_uuid for update;
  update public.profiles set account_status=next_status where id=user_uuid returning * into result;
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,reason,before_data,after_data) values(auth.uid(),'set_account_status','profile',user_uuid,reason,to_jsonb(before_row),to_jsonb(result));
  return result;
end $$;

create or replace function public.admin_moderate_review(review_uuid uuid, hidden boolean, reason text)
returns public.reviews language plpgsql security definer set search_path = '' as $$
declare before_row public.reviews; result public.reviews;
begin
  if not public.is_admin() or char_length(trim(reason)) < 3 then raise exception using errcode='P0001', message='AUTHORIZATION_DENIED'; end if;
  select * into before_row from public.reviews where id=review_uuid for update;
  update public.reviews set is_hidden=hidden where id=review_uuid returning * into result;
  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,reason,before_data,after_data) values(auth.uid(),'moderate_review','review',review_uuid,reason,to_jsonb(before_row),to_jsonb(result));
  return result;
end $$;

grant execute on function public.admin_review_worker(uuid,public.worker_application_status,text) to authenticated;
grant execute on function public.admin_set_account_status(uuid,public.account_status,text) to authenticated;
grant execute on function public.admin_moderate_review(uuid,boolean,text) to authenticated;
