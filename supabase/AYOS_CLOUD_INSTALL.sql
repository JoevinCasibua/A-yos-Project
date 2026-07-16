-- A-YOS Supabase Cloud Installer
-- Target: a fresh Supabase project only.
-- Paste this entire file into the Supabase SQL Editor and run it once.
-- The transaction is atomic: any error prevents the installer from committing.
--
-- This installs the database, RLS, Storage, Realtime, and RPC foundation.
-- Supabase Edge Functions and their secrets must be deployed separately; see
-- SUPABASE_CLOUD_SETUP.md.

begin;

do $ayos_preflight$
begin
  if to_regclass('public.profiles') is not null
     or to_regclass('public.service_requests') is not null
     or to_regclass('public.bookings') is not null then
    raise exception using
      errcode = 'P0001',
      message = 'A_YOS_INSTALL_REFUSED',
      detail = 'Existing A-YOS tables were detected. This installer is for a fresh Supabase project and will not overwrite or upgrade an existing schema.';
  end if;
end
$ayos_preflight$;

create schema if not exists extensions;

-- Source: supabase/migrations/20260716000100_ayos_mvp.sql
create extension if not exists pgcrypto with schema extensions;
create extension if not exists postgis with schema extensions;
create type public.account_status as enum ('active','suspended','deactivated');
create type public.app_role as enum ('customer','worker','admin');
create type public.verification_status as enum ('pending','approved','rejected','resubmission_required');
create type public.worker_application_status as enum ('pending','approved','rejected','suspended');
create type public.request_status as enum ('draft','searching','assigned','cancelled');
create type public.booking_status as enum ('scheduled','accepted','en_route','arrived','in_progress','pending_confirmation','completed','cancelled');
create type public.cash_status as enum ('unpaid','paid','disputed','void');
create type public.translation_status as enum ('complete','partial','failed');
create type public.route_status as enum ('complete','estimated','failed');

create table public.profiles(id uuid primary key references auth.users on delete cascade,first_name text not null default '',middle_name text,last_name text not null default '',phone text,birthday date,gender text,avatar_path text,account_status public.account_status not null default 'active',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.user_roles(user_id uuid references public.profiles on delete cascade,role public.app_role not null,created_at timestamptz not null default now(),primary key(user_id,role));
create table public.addresses(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,label text not null default 'Home',street_number text,street text not null,district text,city text not null,region text not null,postal_code text,location extensions.geography(point,4326),is_default boolean not null default false,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create unique index one_default_address on public.addresses(user_id) where is_default;
create table public.identity_verifications(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,version integer not null default 1,id_type text not null,front_path text not null,back_path text not null,selfie_path text,status public.verification_status not null default 'pending',rejection_reason text,submitted_at timestamptz not null default now(),reviewed_at timestamptz,reviewed_by uuid references public.profiles,unique(user_id,version));
create unique index one_pending_verification on public.identity_verifications(user_id) where status='pending';
create table public.categories(id uuid primary key default gen_random_uuid(),slug text not null unique,name text not null,description text,icon text,is_active boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.worker_applications(id uuid primary key default gen_random_uuid(),user_id uuid not null unique references public.profiles on delete cascade,status public.worker_application_status not null default 'pending',experience_years numeric(4,1) not null default 0,experience_summary text not null,rating numeric(3,2) not null default 0,review_count integer not null default 0,base_location extensions.geography(point,4326),service_radius_meters integer not null default 15000,rejection_reason text,reviewed_at timestamptz,reviewed_by uuid references public.profiles,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(experience_years>=0),check(rating between 0 and 5),check(service_radius_meters>0));
create table public.worker_services(id uuid primary key default gen_random_uuid(),worker_id uuid not null references public.worker_applications on delete cascade,category_id uuid not null references public.categories,title text not null,description text,price_centavos integer not null,is_active boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(price_centavos>=0),unique(worker_id,category_id,title));
create table public.worker_availability(id uuid primary key default gen_random_uuid(),worker_id uuid not null references public.worker_applications on delete cascade,weekday smallint not null,start_time time not null,end_time time not null,is_active boolean not null default true,check(weekday between 0 and 6),check(start_time<end_time),unique(worker_id,weekday,start_time,end_time));
create table public.service_requests(id uuid primary key default gen_random_uuid(),customer_id uuid not null references public.profiles,category_id uuid not null references public.categories,description_original text not null,description_language text not null default 'en',parts_known boolean,parts_description text,urgency text not null,scheduled_at timestamptz,address_id uuid not null references public.addresses,location extensions.geography(point,4326) not null,status public.request_status not null default 'draft',assigned_worker_id uuid references public.worker_applications,created_at timestamptz not null default now(),published_at timestamptz,updated_at timestamptz not null default now(),check(char_length(description_original) between 10 and 4000),check(description_language in('en','fil')),check(urgency in('asap','scheduled')),check((urgency='asap' and scheduled_at is null)or(urgency='scheduled' and scheduled_at is not null)));
create table public.service_request_media(id uuid primary key default gen_random_uuid(),request_id uuid not null references public.service_requests on delete cascade,owner_id uuid not null references public.profiles,object_path text not null unique,media_type text not null default 'image',created_at timestamptz not null default now());
create table public.ai_analyses(id uuid primary key default gen_random_uuid(),request_id uuid not null references public.service_requests on delete cascade,summary text not null,suggested_category_id uuid references public.categories,required_skills text[] not null default '{}',visible_risks text[] not null default '{}',confidence numeric(4,3) not null,provider text not null,model text,is_fallback boolean not null default false,created_at timestamptz not null default now(),check(confidence between 0 and 1));
create table public.recommendations(id uuid primary key default gen_random_uuid(),request_id uuid not null references public.service_requests on delete cascade,worker_id uuid not null references public.worker_applications on delete cascade,rank integer not null,total_score numeric(6,3) not null,skill_score numeric(6,3) not null,distance_score numeric(6,3) not null,availability_score numeric(6,3) not null,rating_score numeric(6,3) not null,experience_score numeric(6,3) not null,explanation text not null,algorithm_version text not null default 'mvp-v1',created_at timestamptz not null default now(),unique(request_id,worker_id),unique(request_id,rank));
create table public.bookings(id uuid primary key default gen_random_uuid(),request_id uuid not null references public.service_requests,customer_id uuid not null references public.profiles,worker_id uuid not null references public.worker_applications,worker_service_id uuid not null references public.worker_services,status public.booking_status not null default 'scheduled',scheduled_at timestamptz not null,price_centavos integer not null,idempotency_key text not null,cancelled_reason text,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(price_centavos>=0),unique(customer_id,idempotency_key));
create unique index one_active_booking on public.bookings(request_id) where status<>'cancelled';
create table public.booking_status_events(id uuid primary key default gen_random_uuid(),booking_id uuid not null references public.bookings on delete cascade,from_status public.booking_status,to_status public.booking_status not null,actor_id uuid not null references public.profiles,note_original text,note_language text,created_at timestamptz not null default now(),check(note_language is null or note_language in('en','fil')));
create table public.workflow_translations(id uuid primary key default gen_random_uuid(),entity_type text not null,entity_id uuid not null,source_language text not null,target_language text not null,original_text text not null,translated_text text,status public.translation_status not null,provider text not null,model text,created_at timestamptz not null default now(),check(entity_type in('service_request','booking_status_event')),check(source_language in('en','fil')),check(target_language in('en','fil')),unique(entity_type,entity_id,target_language));
create table public.route_snapshots(id uuid primary key default gen_random_uuid(),booking_id uuid not null references public.bookings on delete cascade,origin extensions.geography(point,4326) not null,destination extensions.geography(point,4326) not null,distance_meters integer not null,duration_seconds integer not null,geometry jsonb,provider text not null,status public.route_status not null,worker_location_snapshot boolean not null default false,calculated_at timestamptz not null default now(),check(distance_meters>=0),check(duration_seconds>=0));
create table public.cash_records(id uuid primary key default gen_random_uuid(),booking_id uuid not null unique references public.bookings on delete cascade,method text not null default 'cash',amount_centavos integer not null,status public.cash_status not null default 'unpaid',confirmed_at timestamptz,confirmed_by uuid references public.profiles,idempotency_key text,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(method='cash'),check(amount_centavos>=0));
create unique index unique_cash_key on public.cash_records(idempotency_key) where idempotency_key is not null;
create table public.reviews(id uuid primary key default gen_random_uuid(),booking_id uuid not null unique references public.bookings,customer_id uuid not null references public.profiles,worker_id uuid not null references public.worker_applications,rating smallint not null,comment text,is_hidden boolean not null default false,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(rating between 1 and 5),check(comment is null or char_length(comment)<=2000));
create table public.notifications(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,kind text not null,title text not null,body text not null,data jsonb not null default '{}',read_at timestamptz,created_at timestamptz not null default now());
create table public.admin_audit_logs(id uuid primary key default gen_random_uuid(),admin_id uuid not null references public.profiles,action text not null,entity_type text not null,entity_id uuid,reason text not null,before_data jsonb,after_data jsonb,created_at timestamptz not null default now());

create or replace function public.touch_updated_at()returns trigger language plpgsql set search_path='' as $$begin new.updated_at=now();return new;end$$;
do $$declare t text;begin foreach t in array array['profiles','addresses','worker_applications','worker_services','service_requests','bookings','cash_records','reviews'] loop execute format('create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()',t,t);end loop;end$$;
create or replace function public.has_role(wanted public.app_role)returns boolean stable language sql security definer set search_path='' as $$select exists(select 1 from public.user_roles where user_id=auth.uid() and role=wanted)$$;
create or replace function public.is_admin()returns boolean stable language sql security definer set search_path='' as $$select public.has_role('admin')$$;
create or replace function public.is_active_account(user_uuid uuid default auth.uid())returns boolean stable language sql security definer set search_path='' as $$select exists(select 1 from public.profiles where id=user_uuid and account_status='active')$$;
create or replace function public.has_approved_id(user_uuid uuid default auth.uid())returns boolean stable language sql security definer set search_path='' as $$select exists(select 1 from public.identity_verifications where user_id=user_uuid and status='approved')$$;
create or replace function public.current_worker_id()returns uuid stable language sql security definer set search_path='' as $$select id from public.worker_applications where user_id=auth.uid()$$;
create or replace function public.handle_new_user()returns trigger language plpgsql security definer set search_path='' as $$declare initial public.app_role:=coalesce((new.raw_user_meta_data->>'initial_role')::public.app_role,'customer');begin insert into public.profiles(id,first_name,middle_name,last_name,phone)values(new.id,coalesce(new.raw_user_meta_data->>'first_name',''),new.raw_user_meta_data->>'middle_name',coalesce(new.raw_user_meta_data->>'last_name',''),new.raw_user_meta_data->>'phone');if initial='worker'then insert into public.user_roles(user_id,role)values(new.id,'customer'),(new.id,'worker');else insert into public.user_roles(user_id,role)values(new.id,initial);end if;return new;end$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.publish_request(request_uuid uuid)returns public.service_requests language plpgsql security definer set search_path='' as $$declare result public.service_requests;begin if auth.uid() is null then raise exception using message='AUTHENTICATION_REQUIRED';end if;if not public.has_role('customer')then raise exception using message='AUTHORIZATION_DENIED';end if;if not public.is_active_account()then raise exception using message='ACCOUNT_SUSPENDED';end if;if not public.has_approved_id()then raise exception using message='ID_APPROVAL_REQUIRED';end if;update public.service_requests set status='searching',published_at=now()where id=request_uuid and customer_id=auth.uid()and status='draft' returning * into result;if result.id is null then raise exception using message='INVALID_TRANSITION';end if;return result;end$$;
create or replace function public.generate_recommendations(request_uuid uuid)returns setof public.recommendations language plpgsql security definer set search_path='' as $$begin if not exists(select 1 from public.service_requests where id=request_uuid and(customer_id=auth.uid()or public.is_admin()))then raise exception using message='AUTHORIZATION_DENIED';end if;delete from public.recommendations where request_id=request_uuid;insert into public.recommendations(request_id,worker_id,rank,total_score,skill_score,distance_score,availability_score,rating_score,experience_score,explanation)select request_uuid,x.worker_id,row_number()over(order by x.total_score desc,x.worker_id),x.total_score,40,x.distance_score,x.availability_score,x.rating_score,x.experience_score,concat('Category 40%, distance ',round(x.distance_score),'%, availability ',round(x.availability_score),'%.')from(select w.id worker_id,greatest(0,25*(1-least(1,extensions.st_distance(w.base_location,r.location)/greatest(w.service_radius_meters,1)))) distance_score,case when exists(select 1 from public.worker_availability a where a.worker_id=w.id and a.is_active)then 15 else 0 end::numeric availability_score,(w.rating/5*10)::numeric rating_score,least(w.experience_years/10,1)*10 experience_score,40+greatest(0,25*(1-least(1,extensions.st_distance(w.base_location,r.location)/greatest(w.service_radius_meters,1))))+case when exists(select 1 from public.worker_availability a where a.worker_id=w.id and a.is_active)then 15 else 0 end+(w.rating/5*10)+least(w.experience_years/10,1)*10 total_score from public.worker_applications w join public.worker_services s on s.worker_id=w.id and s.is_active join public.service_requests r on r.id=request_uuid and r.category_id=s.category_id join public.profiles p on p.id=w.user_id and p.account_status='active' where w.status='approved' and w.base_location is not null and public.has_approved_id(w.user_id)and extensions.st_dwithin(w.base_location,r.location,w.service_radius_meters))x;return query select * from public.recommendations where request_id=request_uuid order by rank;end$$;
create or replace function public.select_worker(request_uuid uuid,worker_service_uuid uuid,request_key text)returns public.bookings language plpgsql security definer set search_path='' as $$declare req public.service_requests;svc public.worker_services;result public.bookings;begin if not public.is_active_account()then raise exception using message='ACCOUNT_SUSPENDED';end if;if not public.has_approved_id()then raise exception using message='ID_APPROVAL_REQUIRED';end if;select * into req from public.service_requests where id=request_uuid and customer_id=auth.uid()for update;if req.id is null then raise exception using message='AUTHORIZATION_DENIED';end if;if req.status<>'searching'then raise exception using message='CONFLICT';end if;select s.* into svc from public.worker_services s join public.worker_applications w on w.id=s.worker_id join public.profiles p on p.id=w.user_id where s.id=worker_service_uuid and s.is_active and w.status='approved' and p.account_status='active';if svc.id is null or not exists(select 1 from public.recommendations where request_id=request_uuid and worker_id=svc.worker_id)then raise exception using message='WORKER_INELIGIBLE';end if;insert into public.bookings(request_id,customer_id,worker_id,worker_service_id,scheduled_at,price_centavos,idempotency_key)values(req.id,req.customer_id,svc.worker_id,svc.id,coalesce(req.scheduled_at,now()),svc.price_centavos,request_key)returning * into result;update public.service_requests set status='assigned',assigned_worker_id=svc.worker_id where id=req.id;insert into public.booking_status_events(booking_id,to_status,actor_id)values(result.id,'scheduled',auth.uid());insert into public.cash_records(booking_id,amount_centavos)values(result.id,result.price_centavos);return result;exception when unique_violation then select * into result from public.bookings where customer_id=auth.uid()and idempotency_key=request_key;if result.id is null then raise exception using message='CONFLICT';end if;return result;end$$;
create or replace function public.transition_booking(booking_uuid uuid,next_status public.booking_status,note text default null,note_lang text default null)returns public.bookings language plpgsql security definer set search_path='' as $$declare current public.bookings;result public.bookings;allowed boolean;begin select * into current from public.bookings where id=booking_uuid for update;if current.id is null then raise exception using message='VALIDATION_FAILED';end if;if auth.uid()<>current.customer_id and public.current_worker_id()is distinct from current.worker_id and not public.is_admin()then raise exception using message='AUTHORIZATION_DENIED';end if;allowed:=(current.status='scheduled'and next_status in('accepted','cancelled'))or(current.status='accepted'and next_status in('en_route','cancelled'))or(current.status='en_route'and next_status in('arrived','cancelled'))or(current.status='arrived'and next_status='in_progress')or(current.status='in_progress'and next_status='pending_confirmation')or(current.status='pending_confirmation'and next_status in('completed','in_progress'))or public.is_admin();if not allowed then raise exception using message='INVALID_TRANSITION';end if;update public.bookings set status=next_status,cancelled_reason=case when next_status='cancelled'then note else cancelled_reason end where id=booking_uuid returning * into result;insert into public.booking_status_events(booking_id,from_status,to_status,actor_id,note_original,note_language)values(booking_uuid,current.status,next_status,auth.uid(),note,note_lang);if next_status='cancelled'then update public.service_requests set status='searching',assigned_worker_id=null where id=current.request_id;end if;return result;end$$;
create or replace function public.confirm_cash(booking_uuid uuid,request_key text)returns public.cash_records language plpgsql security definer set search_path='' as $$declare b public.bookings;result public.cash_records;begin select * into b from public.bookings where id=booking_uuid;if b.id is null or(public.current_worker_id()is distinct from b.worker_id and not public.is_admin())then raise exception using message='AUTHORIZATION_DENIED';end if;update public.cash_records set status='paid',confirmed_at=coalesce(confirmed_at,now()),confirmed_by=coalesce(confirmed_by,auth.uid()),idempotency_key=coalesce(idempotency_key,request_key)where booking_id=booking_uuid and status in('unpaid','paid')returning * into result;if result.id is null then raise exception using message='INVALID_TRANSITION';end if;return result;end$$;
create or replace function public.submit_review(booking_uuid uuid,stars integer,review_comment text default null)returns public.reviews language plpgsql security definer set search_path='' as $$declare b public.bookings;result public.reviews;begin select * into b from public.bookings where id=booking_uuid and customer_id=auth.uid()and status='completed';if b.id is null then raise exception using message='INVALID_TRANSITION';end if;insert into public.reviews(booking_id,customer_id,worker_id,rating,comment)values(b.id,b.customer_id,b.worker_id,stars,review_comment)returning * into result;update public.worker_applications w set rating=x.avg_rating,review_count=x.total from(select worker_id,avg(rating)::numeric(3,2)avg_rating,count(*)total from public.reviews where worker_id=b.worker_id and not is_hidden group by worker_id)x where w.id=x.worker_id;return result;exception when unique_violation then raise exception using message='CONFLICT';end$$;
create or replace function public.admin_review_identity(verification_uuid uuid,decision public.verification_status,reason text)returns public.identity_verifications language plpgsql security definer set search_path='' as $$declare before_row public.identity_verifications;result public.identity_verifications;begin if not public.is_admin()then raise exception using message='AUTHORIZATION_DENIED';end if;if decision not in('approved','rejected','resubmission_required')or char_length(trim(reason))<3 then raise exception using message='VALIDATION_FAILED';end if;select * into before_row from public.identity_verifications where id=verification_uuid for update;update public.identity_verifications set status=decision,rejection_reason=case when decision='approved'then null else reason end,reviewed_at=now(),reviewed_by=auth.uid()where id=verification_uuid returning * into result;insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,reason,before_data,after_data)values(auth.uid(),'review_identity','identity_verification',verification_uuid,reason,to_jsonb(before_row),to_jsonb(result));return result;end$$;

do $$declare t text;begin foreach t in array array['profiles','user_roles','addresses','identity_verifications','categories','worker_applications','worker_services','worker_availability','service_requests','service_request_media','ai_analyses','recommendations','bookings','booking_status_events','workflow_translations','route_snapshots','cash_records','reviews','notifications','admin_audit_logs']loop execute format('alter table public.%I enable row level security',t);end loop;end$$;
create policy profiles_read on public.profiles for select to authenticated using(id=auth.uid()or public.is_admin()or exists(select 1 from public.worker_applications w where w.user_id=profiles.id and w.status='approved'));
create policy profiles_update on public.profiles for update to authenticated using(id=auth.uid()or public.is_admin())with check(id=auth.uid()or public.is_admin());
create policy roles_read on public.user_roles for select to authenticated using(user_id=auth.uid()or public.is_admin());
create policy addresses_owner on public.addresses for all to authenticated using(user_id=auth.uid()or public.is_admin())with check(user_id=auth.uid()or public.is_admin());
create policy verification_read on public.identity_verifications for select to authenticated using(user_id=auth.uid()or public.is_admin());
create policy verification_insert on public.identity_verifications for insert to authenticated with check(user_id=auth.uid()and status='pending');
create policy category_read on public.categories for select using(is_active or public.is_admin());
create policy category_admin on public.categories for all to authenticated using(public.is_admin())with check(public.is_admin());
create policy workers_read on public.worker_applications for select to authenticated using((status='approved'and public.is_active_account(user_id))or user_id=auth.uid()or public.is_admin());
create policy workers_insert on public.worker_applications for insert to authenticated with check(user_id=auth.uid()and status='pending');
create policy workers_update on public.worker_applications for update to authenticated using(user_id=auth.uid()or public.is_admin())with check(user_id=auth.uid()or public.is_admin());
create policy services_read on public.worker_services for select to authenticated using((is_active and exists(select 1 from public.worker_applications w where w.id=worker_id and w.status='approved'))or worker_id=public.current_worker_id()or public.is_admin());
create policy services_write on public.worker_services for all to authenticated using(worker_id=public.current_worker_id()or public.is_admin())with check(worker_id=public.current_worker_id()or public.is_admin());
create policy availability_owner on public.worker_availability for all to authenticated using(worker_id=public.current_worker_id()or public.is_admin())with check(worker_id=public.current_worker_id()or public.is_admin());
create policy requests_read on public.service_requests for select to authenticated using(customer_id=auth.uid()or assigned_worker_id=public.current_worker_id()or public.is_admin());
create policy requests_insert on public.service_requests for insert to authenticated with check(customer_id=auth.uid()and status='draft'and public.is_active_account()and public.has_role('customer'));
create policy requests_update on public.service_requests for update to authenticated using(customer_id=auth.uid()and status='draft')with check(customer_id=auth.uid()and status='draft');
create policy media_read on public.service_request_media for select to authenticated using(owner_id=auth.uid()or public.is_admin()or exists(select 1 from public.service_requests r where r.id=request_id and r.assigned_worker_id=public.current_worker_id()));
create policy media_insert on public.service_request_media for insert to authenticated with check(owner_id=auth.uid());
create policy analysis_read on public.ai_analyses for select to authenticated using(public.is_admin()or exists(select 1 from public.service_requests r where r.id=request_id and(r.customer_id=auth.uid()or r.assigned_worker_id=public.current_worker_id())));
create policy recs_read on public.recommendations for select to authenticated using(public.is_admin()or exists(select 1 from public.service_requests r where r.id=request_id and r.customer_id=auth.uid()));
create policy bookings_read on public.bookings for select to authenticated using(customer_id=auth.uid()or worker_id=public.current_worker_id()or public.is_admin());
create policy events_read on public.booking_status_events for select to authenticated using(exists(select 1 from public.bookings b where b.id=booking_id and(b.customer_id=auth.uid()or b.worker_id=public.current_worker_id()or public.is_admin())));
create policy translations_read on public.workflow_translations for select to authenticated using(public.is_admin()or(entity_type='service_request'and exists(select 1 from public.service_requests r where r.id=entity_id and(r.customer_id=auth.uid()or r.assigned_worker_id=public.current_worker_id())))or(entity_type='booking_status_event'and exists(select 1 from public.booking_status_events e join public.bookings b on b.id=e.booking_id where e.id=entity_id and(b.customer_id=auth.uid()or b.worker_id=public.current_worker_id()))));
create policy routes_read on public.route_snapshots for select to authenticated using(exists(select 1 from public.bookings b where b.id=booking_id and(b.customer_id=auth.uid()or b.worker_id=public.current_worker_id()or public.is_admin())));
create policy cash_read on public.cash_records for select to authenticated using(exists(select 1 from public.bookings b where b.id=booking_id and(b.customer_id=auth.uid()or b.worker_id=public.current_worker_id()or public.is_admin())));
create policy reviews_read on public.reviews for select using(not is_hidden or customer_id=auth.uid()or public.is_admin());
create policy notifications_read on public.notifications for select to authenticated using(user_id=auth.uid()or public.is_admin());
create policy notifications_update on public.notifications for update to authenticated using(user_id=auth.uid())with check(user_id=auth.uid());
create policy audit_read on public.admin_audit_logs for select to authenticated using(public.is_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)values('identity-documents','identity-documents',false,10485760,array['image/jpeg','image/png','image/webp']),('service-request-media','service-request-media',false,20971520,array['image/jpeg','image/png','image/webp'])on conflict(id)do update set public=false;
create policy identity_upload on storage.objects for insert to authenticated with check(bucket_id='identity-documents'and(storage.foldername(name))[1]=auth.uid()::text);
create policy identity_read on storage.objects for select to authenticated using(bucket_id='identity-documents'and((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));
create policy request_upload on storage.objects for insert to authenticated with check(bucket_id='service-request-media'and(storage.foldername(name))[1]=auth.uid()::text);
create policy request_media_read on storage.objects for select to authenticated using(bucket_id='service-request-media'and((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()or exists(select 1 from public.service_request_media m join public.service_requests r on r.id=m.request_id where m.object_path=name and r.assigned_worker_id=public.current_worker_id())));
alter publication supabase_realtime add table public.bookings,public.booking_status_events,public.notifications;
grant execute on function public.publish_request(uuid),public.generate_recommendations(uuid),public.select_worker(uuid,uuid,text),public.transition_booking(uuid,public.booking_status,text,text),public.confirm_cash(uuid,text),public.submit_review(uuid,integer,text),public.admin_review_identity(uuid,public.verification_status,text)to authenticated;
revoke update on public.profiles from authenticated;
grant update(first_name,middle_name,last_name,phone,birthday,gender,avatar_path,updated_at)on public.profiles to authenticated;
revoke update on public.worker_applications from authenticated;
grant update(experience_years,experience_summary,base_location,service_radius_meters,updated_at)on public.worker_applications to authenticated;

-- Source: supabase/migrations/20260716000200_admin_operations.sql
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

-- Source: supabase/migrations/20260716000300_workflow_integrations.sql
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

-- Source: supabase/migrations/20260716000400_api_privileges.sql
grant usage on schema public to anon, authenticated;

grant select on public.categories, public.reviews to anon;

grant select on public.user_roles, public.addresses,
  public.identity_verifications, public.categories, public.worker_applications,
  public.worker_services, public.worker_availability, public.service_requests,
  public.service_request_media, public.ai_analyses, public.recommendations,
  public.bookings, public.booking_status_events, public.workflow_translations,
  public.route_snapshots, public.cash_records, public.reviews,
  public.notifications, public.admin_audit_logs, public.notification_preferences
to authenticated;

grant select(id,first_name,last_name,avatar_path,account_status,created_at,updated_at) on public.profiles to authenticated;

grant insert, delete on public.addresses to authenticated;
grant update(street_number,street,district,city,region,postal_code,location,is_default,updated_at)
  on public.addresses to authenticated;
grant insert on public.identity_verifications to authenticated;
grant insert on public.worker_applications to authenticated;
grant insert, update, delete on public.worker_services to authenticated;
grant insert, update, delete on public.worker_availability to authenticated;
grant insert, delete on public.service_requests to authenticated;
grant update(category_id,description_original,description_language,parts_known,parts_description,
  urgency,scheduled_at,address_id,location,updated_at) on public.service_requests to authenticated;
grant insert, delete on public.service_request_media to authenticated;
grant insert on public.ai_analyses to authenticated;
grant update(read_at) on public.notifications to authenticated;
grant insert, update, delete on public.notification_preferences to authenticated;

-- Seed only the marketplace categories used by the current frontend/backend.
insert into public.categories(id,slug,name,description,icon) values
  ('40000000-0000-0000-0000-000000000001','plumbing','Plumbing','Pipes, leaks, drains, and fixtures','wrench'),
  ('40000000-0000-0000-0000-000000000002','electrical','Electrical','Home electrical installation and repair','zap'),
  ('40000000-0000-0000-0000-000000000003','cleaning','Cleaning','Residential cleaning services','sparkles'),
  ('40000000-0000-0000-0000-000000000004','carpentry','Carpentry','Furniture and wood repair','hammer'),
  ('40000000-0000-0000-0000-000000000005','aircon','Air Conditioning','Aircon cleaning and repair','wind')
on conflict (id) do nothing;

commit;

-- FIRST ADMIN ACCOUNT (run this statement separately after registering the account):
--
-- insert into public.user_roles(user_id, role)
-- select id, 'admin'::public.app_role
-- from auth.users
-- where lower(email) = lower('REPLACE_WITH_ADMIN_EMAIL')
-- on conflict (user_id, role) do nothing;
--
-- Verify the promotion:
-- select u.email, r.role
-- from auth.users u
-- join public.user_roles r on r.user_id = u.id
-- where lower(u.email) = lower('REPLACE_WITH_ADMIN_EMAIL');
