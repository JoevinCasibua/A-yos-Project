-- A-YOS complete Supabase SQL Editor installer
-- Target: a NEW, EMPTY Supabase project only.
-- Generated from the authoritative migrations by scripts/build-sql-editor-installer.sh.
--
-- Run this file once from the Supabase Dashboard SQL Editor as the project owner.
-- The installer intentionally aborts if core A-YOS objects already exist.
-- It contains development placeholder legal/help content that must be replaced
-- before any production deployment.

begin;

do $preflight$
begin
  if to_regclass('public.accounts') is not null
     or exists (
       select 1
       from pg_type type_record
       join pg_namespace namespace_record
         on namespace_record.oid = type_record.typnamespace
       where namespace_record.nspname = 'public'
         and type_record.typname = 'account_role'
     )
     or to_regprocedure('public.current_role()') is not null then
    raise exception using
      errcode = 'P0001',
      message = 'A_YOS_INSTALL_TARGET_NOT_EMPTY',
      detail = 'Core A-YOS objects already exist in the public schema.',
      hint = 'Run this installer only on a new empty Supabase project. Use migrations for upgrades.';
  end if;
end
$preflight$;

-- ============================================================================
-- 1. Platform schema
-- Source: supabase/migrations/20260720000100_platform.sql
-- ============================================================================

-- A-YOS Supabase platform schema. FR-01–FR-104, NFR-01–NFR-18.
create extension if not exists pgcrypto with schema extensions;
create extension if not exists pgmq;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
create extension if not exists supabase_vault with schema vault;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.account_role as enum ('USER', 'WORKER', 'ADMIN');
create type public.account_status as enum ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED');
create type public.worker_approval_status as enum ('PENDING', 'NEEDS_DOCUMENTS', 'APPROVED', 'REJECTED');
create type public.request_status as enum ('DRAFT', 'OPEN', 'MATCHED', 'BOOKED', 'CLOSED', 'CANCELLED');
create type public.booking_status as enum ('PENDING', 'ACCEPTED', 'WORKER_PREPARING', 'WORKER_EN_ROUTE', 'WORKER_ARRIVED', 'SERVICE_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
create type public.payment_method as enum ('CASH', 'GCASH', 'MAYA', 'CREDIT_DEBIT_CARD', 'WALLET');
create type public.payment_status as enum ('PENDING', 'AWAITING_CONFIRMATIONS', 'SUCCESSFUL', 'FAILED');
create type public.cash_confirmation_party as enum ('USER', 'WORKER');
create type public.refund_status as enum ('PENDING', 'PROCESSED', 'REJECTED');
create type public.review_moderation_status as enum ('PENDING', 'PUBLISHED', 'REJECTED');
create type public.ticket_status as enum ('OPEN', 'ESCALATED', 'RESOLVED', 'CLOSED');
create type public.notification_audience as enum ('USERS', 'WORKERS', 'EVERYONE');
create type public.notification_status as enum ('DRAFT', 'SCHEDULED', 'SENT', 'FAILED');
create type public.content_key as enum ('TERMS', 'PRIVACY', 'REFUND_POLICY', 'HELP_CENTER');

create table public.accounts (
  id uuid primary key references auth.users(id) on delete restrict,
  role public.account_role not null,
  status public.account_status not null default 'ACTIVE',
  email text not null unique check (length(email) <= 254),
  mobile text unique check (mobile is null or mobile ~ '^\+[1-9][0-9]{7,14}$'),
  is_protected boolean not null default false,
  mfa_enabled boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index accounts_role_status_idx on public.accounts(role, status) where deleted_at is null;

create table public.user_profiles (
  account_id uuid primary key references public.accounts(id) on delete restrict,
  display_name text not null check (length(display_name) between 2 and 120),
  avatar_path text,
  notification_preferences jsonb not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.worker_profiles (
  account_id uuid primary key references public.accounts(id) on delete restrict,
  display_name text not null check (length(display_name) between 2 and 120),
  avatar_path text, bio text check (length(bio) <= 2000), experience text check (length(experience) <= 4000),
  service_area text check (length(service_area) <= 255), latitude numeric(9,6), longitude numeric(9,6),
  approval_status public.worker_approval_status not null default 'PENDING',
  recommendation_priority boolean not null default false, is_available boolean not null default false,
  approved_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (latitude is null or latitude between -90 and 90), check (longitude is null or longitude between -180 and 180)
);
create index worker_discovery_idx on public.worker_profiles(approval_status, is_available, recommendation_priority);
create table public.admin_profiles (
  account_id uuid primary key references public.accounts(id) on delete restrict,
  display_name text not null check (length(display_name) between 2 and 120),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.worker_verifications (
  id uuid primary key default gen_random_uuid(), worker_id uuid not null unique references public.worker_profiles(account_id) on delete cascade,
  status public.worker_approval_status not null default 'PENDING', identity_data jsonb not null default '{}',
  document_paths text[] not null default '{}', requested_notes text check (length(requested_notes) <= 2000),
  reviewed_by uuid references public.accounts(id) on delete set null, reviewed_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.worker_availability (
  id uuid primary key default gen_random_uuid(), worker_id uuid not null references public.worker_profiles(account_id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6), start_time time not null, end_time time not null,
  timezone text not null default 'Asia/Manila', unique(worker_id, day_of_week, start_time, end_time), check (start_time < end_time)
);
create table public.service_categories (
  id uuid primary key default gen_random_uuid(), name text not null unique check (length(name) between 2 and 120),
  description text check (length(description) <= 1000), is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.worker_skills (
  worker_id uuid not null references public.worker_profiles(account_id) on delete cascade,
  category_id uuid not null references public.service_categories(id) on delete restrict,
  years integer not null default 0 check (years between 0 and 80), primary key(worker_id, category_id)
);
create table public.addresses (
  id uuid primary key default gen_random_uuid(), account_id uuid not null references public.accounts(id) on delete cascade,
  label text not null check (length(label) between 1 and 80), line1 text not null check (length(line1) <= 255),
  line2 text check (length(line2) <= 255), barangay text not null check (length(barangay) <= 120),
  city text not null check (length(city) <= 120), province text not null check (length(province) <= 120), postal_code text,
  latitude numeric(9,6), longitude numeric(9,6), is_default boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index one_default_address_per_account on public.addresses(account_id) where is_default;

create table public.ai_analyses (
  id uuid primary key default gen_random_uuid(), account_id uuid not null references public.accounts(id) on delete restrict,
  input_type text not null check (input_type in ('IMAGE','VOICE','TEXT')), input_storage_path text, transcript text,
  detected_issue text, severity text, possible_cause text, suggested_category_name text,
  estimated_cost_minimum numeric(12,2), estimated_cost_maximum numeric(12,2), safety_advice text,
  provider text not null, provider_reference text, saved boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.service_requests (
  id uuid primary key default gen_random_uuid(), user_account_id uuid not null references public.user_profiles(account_id) on delete restrict,
  category_id uuid not null references public.service_categories(id) on delete restrict,
  address_id uuid not null references public.addresses(id) on delete restrict, ai_analysis_id uuid unique references public.ai_analyses(id) on delete set null,
  status public.request_status not null default 'DRAFT', description text not null check (length(description) between 10 and 4000),
  scheduled_at timestamptz not null, budget numeric(12,2) not null check (budget > 0), notes text check (length(notes) <= 2000),
  notify_on_match boolean not null default false, selected_worker_id uuid references public.worker_profiles(account_id) on delete restrict,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index service_requests_user_status_idx on public.service_requests(user_account_id, status);
create index service_requests_matching_idx on public.service_requests(category_id, status, scheduled_at);
create table public.request_media (
  id uuid primary key default gen_random_uuid(), service_request_id uuid not null references public.service_requests(id) on delete cascade,
  storage_path text not null, content_type text not null, byte_size integer not null check (byte_size > 0 and byte_size <= 15728640), created_at timestamptz not null default now()
);
create table public.match_candidates (
  id uuid primary key default gen_random_uuid(), service_request_id uuid not null references public.service_requests(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(account_id) on delete restrict, score numeric(7,4) not null,
  rank integer not null check (rank > 0), factors jsonb not null default '{}', eligible boolean not null,
  created_at timestamptz not null default now(), unique(service_request_id, worker_id)
);
create index match_candidate_order_idx on public.match_candidates(service_request_id, eligible, rank);

create table public.bookings (
  id uuid primary key default gen_random_uuid(), service_request_id uuid not null references public.service_requests(id) on delete restrict,
  user_account_id uuid not null references public.user_profiles(account_id) on delete restrict,
  worker_account_id uuid not null references public.worker_profiles(account_id) on delete restrict,
  status public.booking_status not null default 'PENDING', version integer not null default 0 check (version >= 0),
  response_due_at timestamptz not null default (now() + interval '15 minutes'), accepted_at timestamptz,
  completed_at timestamptz, cancelled_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index one_active_booking_per_request on public.bookings(service_request_id) where status <> 'CANCELLED';
create index bookings_user_status_idx on public.bookings(user_account_id, status);
create index bookings_worker_status_idx on public.bookings(worker_account_id, status);
create table public.booking_status_events (
  id uuid primary key default gen_random_uuid(), booking_id uuid not null references public.bookings(id) on delete cascade,
  from_status public.booking_status, to_status public.booking_status not null, actor_id uuid not null references public.accounts(id) on delete restrict,
  reason text check (length(reason) <= 1000), created_at timestamptz not null default now()
);
create table public.cancellations (
  id uuid primary key default gen_random_uuid(), booking_id uuid not null unique references public.bookings(id) on delete cascade,
  cancelled_by uuid not null references public.accounts(id) on delete restrict, reason text not null check (length(reason) between 3 and 1000),
  policy_version text not null, confirmed_at timestamptz not null default now()
);
create table public.location_updates (
  id uuid primary key default gen_random_uuid(), booking_id uuid not null references public.bookings(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete restrict, latitude numeric(9,6) not null check (latitude between -90 and 90),
  longitude numeric(9,6) not null check (longitude between -180 and 180), recorded_at timestamptz not null default now()
);
create index location_updates_booking_time_idx on public.location_updates(booking_id, recorded_at desc);

create table public.payments (
  id uuid primary key default gen_random_uuid(), booking_id uuid not null unique references public.bookings(id) on delete restrict,
  method public.payment_method not null check (method = 'CASH'), status public.payment_status not null default 'AWAITING_CONFIRMATIONS',
  service_amount numeric(12,2) not null check (service_amount > 0), commission_rate numeric(5,4) not null default 0.1000 check (commission_rate between 0 and 1),
  commission_amount numeric(12,2) not null, worker_net_amount numeric(12,2) not null, homeowner_platform_charge numeric(12,2) not null default 0,
  idempotency_key text not null unique check (length(idempotency_key) between 16 and 128), failure_reason text, successful_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.cash_confirmations (
  id uuid primary key default gen_random_uuid(), payment_id uuid not null references public.payments(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete restrict, party public.cash_confirmation_party not null,
  confirmed_at timestamptz not null default now(), unique(payment_id, party)
);
create table public.receipts (
  id uuid primary key default gen_random_uuid(), payment_id uuid not null unique references public.payments(id) on delete restrict,
  receipt_number text not null unique, service_amount numeric(12,2) not null, commission_rate numeric(5,4) not null,
  commission_amount numeric(12,2) not null, worker_net_amount numeric(12,2) not null, homeowner_platform_charge numeric(12,2) not null,
  issued_at timestamptz not null default now()
);
create table public.refunds (
  id uuid primary key default gen_random_uuid(), payment_id uuid not null unique references public.payments(id) on delete restrict,
  status public.refund_status not null default 'PENDING', reason text not null check (length(reason) between 3 and 1000),
  decided_by uuid references public.accounts(id) on delete set null, decided_at timestamptz, created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(), booking_id uuid not null unique references public.bookings(id) on delete restrict,
  user_account_id uuid not null references public.user_profiles(account_id) on delete restrict,
  worker_account_id uuid not null references public.worker_profiles(account_id) on delete restrict,
  stars smallint not null check (stars between 1 and 5), body text not null check (length(body) between 3 and 4000),
  recommend_worker boolean not null, moderation_status public.review_moderation_status not null default 'PENDING',
  moderated_by uuid references public.accounts(id) on delete set null, moderated_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index reviews_worker_status_idx on public.reviews(worker_account_id, moderation_status);
create table public.review_media (
  id uuid primary key default gen_random_uuid(), review_id uuid not null references public.reviews(id) on delete cascade,
  storage_path text not null, content_type text not null, byte_size integer not null check (byte_size > 0 and byte_size <= 15728640)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(), booking_id uuid unique references public.bookings(id) on delete restrict,
  service_request_id uuid references public.service_requests(id) on delete restrict,
  worker_account_id uuid references public.worker_profiles(account_id) on delete restrict,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index one_preselection_conversation on public.conversations(service_request_id,worker_account_id) where booking_id is null;
create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade, joined_at timestamptz not null default now(),
  primary key(conversation_id, account_id)
);
create index conversation_participants_account_idx on public.conversation_participants(account_id);
create table public.messages (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.accounts(id) on delete restrict, body text check (length(body) <= 4000),
  original_locale text, created_at timestamptz not null default now(), check (body is not null or original_locale is null)
);
create index messages_conversation_time_idx on public.messages(conversation_id, created_at desc);
create table public.message_attachments (
  id uuid primary key default gen_random_uuid(), message_id uuid not null references public.messages(id) on delete cascade,
  kind text not null check (kind in ('IMAGE','LOCATION','VOICE')), storage_path text, location jsonb, content_type text,
  byte_size integer check (byte_size is null or byte_size between 1 and 15728640)
);
create table public.message_translations (
  id uuid primary key default gen_random_uuid(), message_id uuid not null references public.messages(id) on delete cascade,
  target_locale text not null, translated text not null, provider text not null, created_at timestamptz not null default now(),
  unique(message_id, target_locale)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(), recipient_id uuid references public.accounts(id) on delete cascade,
  audience public.notification_audience, title text not null check (length(title) between 1 and 160), body text not null,
  category text not null, status public.notification_status not null default 'DRAFT', scheduled_at timestamptz, sent_at timestamptz,
  source_key text unique, read_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (recipient_id is not null or audience is not null)
);
create index notifications_recipient_time_idx on public.notifications(recipient_id, created_at desc);
create index notifications_schedule_idx on public.notifications(status, scheduled_at);
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.accounts(id) on delete restrict,
  booking_id uuid references public.bookings(id) on delete set null, subject text not null check (length(subject) between 3 and 200),
  description text not null check (length(description) between 10 and 4000), status public.ticket_status not null default 'OPEN',
  resolution text, escalated_at timestamptz, resolved_at timestamptz, closed_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.content_pages (
  id uuid primary key default gen_random_uuid(), key public.content_key not null unique, title text not null,
  body text not null, version text not null, published_at timestamptz, updated_by uuid references public.accounts(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.system_settings (
  key text primary key, value jsonb not null, updated_by uuid references public.accounts(id) on delete set null, updated_at timestamptz not null default now()
);
create table public.trash_entries (
  id uuid primary key default gen_random_uuid(), entity_type text not null, entity_id text not null, snapshot jsonb not null,
  deleted_by uuid not null references public.accounts(id) on delete restrict, deleted_at timestamptz not null default now(),
  restored_at timestamptz, restored_by uuid references public.accounts(id) on delete set null
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references public.accounts(id) on delete set null,
  action text not null, entity_type text, entity_id text, correlation_id text not null default gen_random_uuid()::text,
  metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create index audit_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);
create table public.report_exports (
  id uuid primary key default gen_random_uuid(), report_type text not null, parameters jsonb not null default '{}', storage_path text,
  status text not null check (status in ('QUEUED','PROCESSING','COMPLETED','FAILED')), requested_by uuid not null references public.accounts(id) on delete restrict,
  failure_reason text, created_at timestamptz not null default now(), completed_at timestamptz
);
create table public.favorites (
  user_account_id uuid not null references public.user_profiles(account_id) on delete cascade,
  worker_account_id uuid not null references public.worker_profiles(account_id) on delete cascade,
  created_at timestamptz not null default now(), primary key(user_account_id, worker_account_id)
);
create table public.job_failures (
  id uuid primary key default gen_random_uuid(), queue_name text not null, message_id bigint, payload jsonb not null,
  attempts integer not null, error text not null, failed_at timestamptz not null default now(), resolved_at timestamptz,
  resolved_by uuid references public.accounts(id) on delete set null
);
create unique index job_failures_queue_message_idx on public.job_failures(queue_name,message_id);

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
do $$ declare t text; begin foreach t in array array['accounts','user_profiles','worker_profiles','admin_profiles','worker_verifications','service_categories','addresses','service_requests','bookings','payments','reviews','conversations','notifications','support_tickets','content_pages'] loop execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t); end loop; end $$;

create or replace function public.current_role() returns public.account_role language sql stable security definer set search_path = '' as $$
  select role from public.accounts where id = auth.uid() and status = 'ACTIVE' and deleted_at is null
$$;
create or replace function public.is_admin(require_aal2 boolean default false) returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select role = 'ADMIN' and status = 'ACTIVE' and deleted_at is null and (not require_aal2 or not mfa_enabled or coalesce(auth.jwt()->>'aal','aal1') = 'aal2') from public.accounts where id = auth.uid()), false)
$$;
create or replace function public.is_booking_party(target_booking uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.bookings where id = target_booking and (user_account_id = auth.uid() or worker_account_id = auth.uid())) or public.is_admin(false)
$$;
create or replace function public.is_conversation_participant(target_conversation uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.conversation_participants where conversation_id = target_conversation and account_id = auth.uid()) or public.is_admin(false)
$$;

create or replace function public.provision_account() returns trigger language plpgsql security definer set search_path = '' as $$
declare requested_role public.account_role; display_name text; mobile_value text; app_role text;
begin
  app_role := upper(coalesce(new.raw_app_meta_data->>'ayos_role',''));
  requested_role := (case when app_role='ADMIN' then app_role else upper(coalesce(new.raw_user_meta_data->>'role','')) end)::public.account_role;
  if requested_role not in ('USER','WORKER','ADMIN') then raise exception using errcode='42501', message='Invalid account role'; end if;
  if requested_role='ADMIN' and app_role<>'ADMIN' then raise exception using errcode='42501', message='Administrator self-registration is prohibited'; end if;
  if requested_role<>'ADMIN' and not exists(select 1 from public.content_pages where key='TERMS' and published_at is not null) then raise exception using errcode='P0001',message='Registration is unavailable until Terms are published'; end if;
  display_name := trim(coalesce(new.raw_user_meta_data->>'name',''));
  mobile_value := nullif(trim(coalesce(new.raw_user_meta_data->>'mobile','')), '');
  if length(display_name) < 2 then raise exception using errcode='22023', message='A valid display name is required'; end if;
  insert into public.accounts(id, role, status, email, mobile, is_protected)
  values(
    new.id,
    requested_role,
    case when requested_role='ADMIN' or new.email_confirmed_at is not null then 'ACTIVE'::public.account_status else 'PENDING_VERIFICATION'::public.account_status end,
    lower(new.email),
    mobile_value,
    requested_role='ADMIN'
  );
  if requested_role = 'USER' then insert into public.user_profiles(account_id, display_name) values(new.id, display_name);
  elsif requested_role = 'WORKER' then insert into public.worker_profiles(account_id, display_name) values(new.id, display_name);
  else insert into public.admin_profiles(account_id, display_name) values(new.id, display_name); end if;
  return new;
exception when invalid_text_representation then raise exception using errcode='42501', message='Invalid account role';
end $$;
create trigger provision_account_after_auth_insert after insert on auth.users for each row execute function public.provision_account();

create or replace function public.activate_confirmed_account() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    update public.accounts set status='ACTIVE' where id=new.id and status='PENDING_VERIFICATION';
  end if;
  return new;
end $$;
create trigger activate_account_after_email_confirmation after update of email_confirmed_at on auth.users for each row execute function public.activate_confirmed_account();

create or replace function public.prevent_account_security_changes() returns trigger language plpgsql set search_path = '' as $$
begin
  if old.role <> new.role then raise exception using errcode='42501', message='Account roles are immutable'; end if;
  if old.is_protected and new.deleted_at is not null then raise exception using errcode='42501', message='Protected administrators cannot be deleted'; end if;
  return new;
end $$;
create trigger protect_account before update on public.accounts for each row execute function public.prevent_account_security_changes();

comment on table public.accounts is 'FR-01–FR-09, FR-19, FR-49–FR-51, FR-89–FR-91, FR-99–FR-101';
comment on table public.bookings is 'FR-14–FR-18, FR-58–FR-62, FR-104';
comment on table public.payments is 'FR-25–FR-28, FR-73';
comment on table public.ai_analyses is 'FR-92–FR-98';

-- ============================================================================
-- 2. Domain RPCs
-- Source: supabase/migrations/20260720000200_domain_rpcs.sql
-- ============================================================================

-- Atomic domain commands. Direct table grants intentionally exclude these writes.
create or replace function public.create_service_request(
  category_id uuid, address_id uuid, description text, scheduled_at timestamptz,
  budget numeric, notes text default null, ai_analysis_id uuid default null,
  notify_on_match boolean default false
) returns public.service_requests language plpgsql security definer set search_path = '' as $$
declare result public.service_requests;
begin
  if public.current_role() <> 'USER' then raise exception using errcode='42501', message='USER role required'; end if;
  if not exists(select 1 from public.content_pages where key='TERMS' and published_at is not null) then raise exception using errcode='P0001', message='CONTENT_NOT_CONFIGURED'; end if;
  if not exists(select 1 from public.addresses where id = address_id and account_id = auth.uid()) then raise exception using errcode='42501', message='Address is unavailable'; end if;
  if scheduled_at <= now() or budget <= 0 or length(trim(description)) not between 10 and 4000 then raise exception using errcode='22023', message='Invalid service request'; end if;
  insert into public.service_requests(user_account_id, category_id, address_id, description, scheduled_at, budget, notes, ai_analysis_id, notify_on_match, status)
  values(auth.uid(), category_id, address_id, trim(description), scheduled_at, round(budget,2), nullif(trim(notes),''), ai_analysis_id, notify_on_match, 'OPEN') returning * into result;
  return result;
end $$;

create or replace function public.select_worker(p_service_request_id uuid, p_worker_id uuid)
returns public.bookings language plpgsql security definer set search_path = '' as $$
declare request public.service_requests; result public.bookings; conversation_id uuid;
begin
  select * into request from public.service_requests where id = p_service_request_id for update;
  if request.user_account_id is distinct from auth.uid() or request.status not in ('OPEN','MATCHED') then raise exception using errcode='42501', message='Service request cannot be selected'; end if;
  if not exists(select 1 from public.worker_profiles wp join public.worker_skills ws on ws.worker_id=wp.account_id where wp.account_id=p_worker_id and wp.approval_status='APPROVED' and wp.is_available and ws.category_id=request.category_id) then raise exception using errcode='P0001', message='WORKER_UNAVAILABLE'; end if;
  insert into public.bookings(service_request_id,user_account_id,worker_account_id) values(request.id,auth.uid(),p_worker_id) returning * into result;
  insert into public.booking_status_events(booking_id,to_status,actor_id) values(result.id,'PENDING',auth.uid());
  insert into public.conversations(booking_id) values(result.id) returning id into conversation_id;
  insert into public.conversation_participants(conversation_id,account_id) values(conversation_id,auth.uid()),(conversation_id,p_worker_id);
  update public.service_requests set status='BOOKED', selected_worker_id=p_worker_id where id=request.id;
  perform pgmq.send('booking_timeouts', jsonb_build_object('booking_id',result.id,'due_at',result.response_due_at,'attempt',0));
  return result;
end $$;

create or replace function public.generate_matches(p_service_request_id uuid)
returns setof public.match_candidates language plpgsql security definer set search_path='' as $$
declare request public.service_requests; matched_count integer;
begin
  select * into request from public.service_requests where id=p_service_request_id for update;
  if request.user_account_id is distinct from auth.uid() or request.status not in ('OPEN','MATCHED') then raise exception using errcode='42501',message='Service request unavailable'; end if;
  delete from public.match_candidates where service_request_id=request.id;
  insert into public.match_candidates(service_request_id,worker_id,score,rank,factors,eligible)
  select request.id, ranked.worker_id, ranked.score, ranked.rank,
    jsonb_build_object('category',true,'available',true,'years',ranked.years,'rating',ranked.rating,'recommendation_priority',ranked.recommendation_priority),true
  from (
    select wp.account_id worker_id, ws.years, coalesce(avg(r.stars) filter(where r.moderation_status='PUBLISHED'),0)::numeric(3,2) rating,
      wp.recommendation_priority,
      (ws.years*5 + coalesce(avg(r.stars) filter(where r.moderation_status='PUBLISHED'),0)*10 + case when wp.recommendation_priority then 0.01 else 0 end)::numeric(7,4) score,
      row_number() over(order by ws.years*5 + coalesce(avg(r.stars) filter(where r.moderation_status='PUBLISHED'),0)*10 desc,wp.recommendation_priority desc,wp.account_id)::integer rank
    from public.worker_profiles wp join public.worker_skills ws on ws.worker_id=wp.account_id
    left join public.reviews r on r.worker_account_id=wp.account_id
    where ws.category_id=request.category_id and wp.approval_status='APPROVED' and wp.is_available
      and exists(select 1 from public.worker_availability wa where wa.worker_id=wp.account_id and wa.day_of_week=extract(dow from request.scheduled_at)::integer and request.scheduled_at::time between wa.start_time and wa.end_time)
    group by wp.account_id,ws.years,wp.recommendation_priority
  ) ranked where ranked.rank <= 5;
  get diagnostics matched_count=row_count;
  if matched_count>0 then update public.service_requests set status='MATCHED' where id=request.id;
  else perform pgmq.send('no_match_notifications',jsonb_build_object('service_request_id',request.id,'user_account_id',request.user_account_id),300); end if;
  return query select * from public.match_candidates where public.match_candidates.service_request_id=request.id order by rank;
end $$;

create or replace function public.start_worker_conversation(p_service_request_id uuid, p_worker_id uuid)
returns public.conversations language plpgsql security definer set search_path='' as $$
declare result public.conversations;
begin
  if not exists(select 1 from public.service_requests r where r.id=p_service_request_id and r.user_account_id=auth.uid() and r.status in ('OPEN','MATCHED'))
    or not exists(select 1 from public.match_candidates m where m.service_request_id=p_service_request_id and m.worker_id=p_worker_id and m.eligible) then
    raise exception using errcode='42501',message='Conversation is unavailable'; end if;
  insert into public.conversations(service_request_id,worker_account_id) values(p_service_request_id,p_worker_id)
  on conflict(service_request_id,worker_account_id) where booking_id is null do update set updated_at=now() returning * into result;
  insert into public.conversation_participants(conversation_id,account_id) values(result.id,auth.uid()),(result.id,p_worker_id) on conflict do nothing;
  return result;
end $$;

create or replace function public.transition_booking(p_booking_id uuid, p_target_status public.booking_status, p_expected_version integer, p_reason text default null)
returns public.bookings language plpgsql security definer set search_path = '' as $$
declare booking public.bookings; allowed boolean := false; result public.bookings;
begin
  select * into booking from public.bookings b where b.id=p_booking_id for update;
  if booking.id is null or not public.is_booking_party(p_booking_id) then raise exception using errcode='42501', message='Booking unavailable'; end if;
  if booking.version <> p_expected_version then raise exception using errcode='40001', message='BOOKING_VERSION_CONFLICT'; end if;
  allowed := case booking.status
    when 'PENDING' then p_target_status in ('ACCEPTED','CANCELLED')
    when 'ACCEPTED' then p_target_status in ('WORKER_PREPARING','CANCELLED')
    when 'WORKER_PREPARING' then p_target_status in ('WORKER_EN_ROUTE','CANCELLED')
    when 'WORKER_EN_ROUTE' then p_target_status in ('WORKER_ARRIVED','CANCELLED')
    when 'WORKER_ARRIVED' then p_target_status in ('SERVICE_STARTED','CANCELLED')
    when 'SERVICE_STARTED' then p_target_status in ('IN_PROGRESS','CANCELLED')
    when 'IN_PROGRESS' then p_target_status in ('COMPLETED','CANCELLED') else false end;
  if not allowed then raise exception using errcode='P0001', message='INVALID_BOOKING_TRANSITION'; end if;
  if p_target_status not in ('CANCELLED') and auth.uid() <> booking.worker_account_id and not public.is_admin(true) then raise exception using errcode='42501', message='Worker or administrator required'; end if;
  if p_target_status='CANCELLED' and (p_reason is null or length(trim(p_reason)) < 3) then raise exception using errcode='22023', message='Cancellation reason required'; end if;
  if p_target_status='ACCEPTED' and auth.uid() <> booking.worker_account_id then raise exception using errcode='42501', message='Assigned worker required'; end if;
  update public.bookings set status=p_target_status, version=version+1,
    accepted_at=case when p_target_status='ACCEPTED' then now() else accepted_at end,
    completed_at=case when p_target_status='COMPLETED' then now() else completed_at end,
    cancelled_at=case when p_target_status='CANCELLED' then now() else cancelled_at end
  where id=booking.id returning * into result;
  insert into public.booking_status_events(booking_id,from_status,to_status,actor_id,reason) values(booking.id,booking.status,p_target_status,auth.uid(),nullif(trim(p_reason),''));
  if p_target_status='CANCELLED' then
    insert into public.cancellations(booking_id,cancelled_by,reason,policy_version)
    values(booking.id,auth.uid(),trim(p_reason),(select version from public.content_pages where key='REFUND_POLICY' and published_at is not null))
    on conflict on constraint cancellations_booking_id_key do nothing;
    update public.service_requests set status='OPEN',selected_worker_id=null where id=booking.service_request_id;
  elsif p_target_status='COMPLETED' then update public.service_requests set status='CLOSED' where id=booking.service_request_id; end if;
  return result;
end $$;

create or replace function public.record_worker_location(booking_id uuid, latitude numeric, longitude numeric)
returns public.location_updates language plpgsql security definer set search_path = '' as $$
declare booking public.bookings; result public.location_updates;
begin
  select * into booking from public.bookings where id=booking_id;
  if booking.worker_account_id is distinct from auth.uid() or booking.status not in ('WORKER_EN_ROUTE','WORKER_ARRIVED','SERVICE_STARTED','IN_PROGRESS') then raise exception using errcode='42501', message='Location update not allowed'; end if;
  if latitude not between -90 and 90 or longitude not between -180 and 180 then raise exception using errcode='22023', message='Invalid coordinates'; end if;
  insert into public.location_updates(booking_id,account_id,latitude,longitude) values(booking.id,auth.uid(),latitude,longitude) returning * into result;
  return result;
end $$;

create or replace function public.confirm_cash_payment(p_booking_id uuid, p_idempotency_key text)
returns public.payments language plpgsql security definer set search_path = '' as $$
declare booking public.bookings; payment public.payments; confirmation_party public.cash_confirmation_party; amount numeric(12,2); rate numeric(5,4); commission numeric(12,2);
begin
  select * into booking from public.bookings where id=p_booking_id for update;
  if booking.status <> 'COMPLETED' or auth.uid() not in (booking.user_account_id,booking.worker_account_id) then raise exception using errcode='42501', message='Cash confirmation not allowed'; end if;
  if length(p_idempotency_key) not between 16 and 128 then raise exception using errcode='22023', message='Invalid idempotency key'; end if;
  amount := (select budget from public.service_requests where id=booking.service_request_id); rate := 0.1000; commission := round(amount*rate,2);
  insert into public.payments(booking_id,method,status,service_amount,commission_rate,commission_amount,worker_net_amount,idempotency_key)
  values(booking.id,'CASH','AWAITING_CONFIRMATIONS',amount,rate,commission,amount-commission,p_idempotency_key)
  on conflict(booking_id) do update set updated_at=now() returning * into payment;
  confirmation_party := case when auth.uid()=booking.user_account_id then 'USER'::public.cash_confirmation_party else 'WORKER'::public.cash_confirmation_party end;
  insert into public.cash_confirmations(payment_id,account_id,party) values(payment.id,auth.uid(),confirmation_party) on conflict(payment_id,party) do nothing;
  if (select count(*) from public.cash_confirmations where payment_id=payment.id)=2 then
    update public.payments set status='SUCCESSFUL',successful_at=coalesce(successful_at,now()) where id=payment.id returning * into payment;
    insert into public.receipts(payment_id,receipt_number,service_amount,commission_rate,commission_amount,worker_net_amount,homeowner_platform_charge)
    values(payment.id,'AYOS-'||upper(substr(replace(payment.id::text,'-',''),1,12)),payment.service_amount,payment.commission_rate,payment.commission_amount,payment.worker_net_amount,payment.homeowner_platform_charge) on conflict(payment_id) do nothing;
  end if;
  return payment;
end $$;

create or replace function public.create_review(p_booking_id uuid, stars integer, body text, recommend_worker boolean)
returns public.reviews language plpgsql security definer set search_path = '' as $$
declare booking public.bookings; result public.reviews;
begin
  select * into booking from public.bookings where id=p_booking_id;
  if booking.user_account_id is distinct from auth.uid() or booking.status <> 'COMPLETED' or not exists(select 1 from public.payments where booking_id=booking.id and status='SUCCESSFUL') then raise exception using errcode='42501', message='REVIEW_NOT_ALLOWED'; end if;
  if stars not between 1 and 5 or length(trim(body)) not between 3 and 4000 then raise exception using errcode='22023', message='Invalid review'; end if;
  insert into public.reviews(booking_id,user_account_id,worker_account_id,stars,body,recommend_worker)
  values(booking.id,booking.user_account_id,booking.worker_account_id,stars,trim(body),recommend_worker) returning * into result;
  return result;
end $$;

create or replace function public.review_worker_verification(verification_id uuid, decision public.worker_approval_status, notes text default null)
returns public.worker_verifications language plpgsql security definer set search_path = '' as $$
declare verification public.worker_verifications; result public.worker_verifications;
begin
  if not public.is_admin(true) or decision not in ('APPROVED','NEEDS_DOCUMENTS','REJECTED') then raise exception using errcode='42501', message='AAL2 administrator required'; end if;
  select * into verification from public.worker_verifications where id=verification_id for update;
  update public.worker_verifications set status=decision,requested_notes=notes,reviewed_by=auth.uid(),reviewed_at=now() where id=verification.id returning * into result;
  update public.worker_profiles set approval_status=decision,approved_at=case when decision='APPROVED' then now() else null end,is_available=case when decision='APPROVED' then is_available else false end where account_id=verification.worker_id;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(auth.uid(),'WORKER_VERIFICATION_REVIEWED','worker_verification',verification.id::text,jsonb_build_object('decision',decision));
  return result;
end $$;

create or replace function public.set_account_status(account_id uuid, next_status public.account_status)
returns public.accounts language plpgsql security definer set search_path = '' as $$
declare result public.accounts;
begin
  if not public.is_admin(true) then raise exception using errcode='42501', message='AAL2 administrator required'; end if;
  update public.accounts set status=next_status where id=account_id returning * into result;
  if result.id is null then raise exception using errcode='P0002', message='Account not found'; end if;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(auth.uid(),'ACCOUNT_STATUS_CHANGED','account',account_id::text,jsonb_build_object('status',next_status));
  return result;
end $$;

create or replace function public.set_recommendation_priority(worker_id uuid, enabled boolean)
returns public.worker_profiles language plpgsql security definer set search_path = '' as $$
declare result public.worker_profiles;
begin
  if not public.is_admin(true) then raise exception using errcode='42501', message='AAL2 administrator required'; end if;
  update public.worker_profiles set recommendation_priority=enabled where account_id=worker_id returning * into result;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(auth.uid(),'RECOMMENDATION_PRIORITY_CHANGED','worker',worker_id::text,jsonb_build_object('enabled',enabled));
  return result;
end $$;

create or replace function public.decide_refund(p_refund_id uuid, p_decision public.refund_status, p_reason text)
returns public.refunds language plpgsql security definer set search_path = '' as $$
declare result public.refunds;
begin
  if not public.is_admin(true) or p_decision not in ('PROCESSED','REJECTED') then raise exception using errcode='42501', message='AAL2 administrator required'; end if;
  update public.refunds r set status=p_decision,reason=trim(p_reason),decided_by=auth.uid(),decided_at=now() where r.id=p_refund_id and r.status='PENDING' returning * into result;
  if result.id is null then raise exception using errcode='P0001', message='REFUND_DECISION_NOT_ALLOWED'; end if;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(auth.uid(),'REFUND_DECIDED','refund',p_refund_id::text,jsonb_build_object('decision',p_decision));
  return result;
end $$;

create or replace function public.move_to_trash(entity_type text, entity_id text, snapshot jsonb)
returns public.trash_entries language plpgsql security definer set search_path = '' as $$
declare result public.trash_entries;
begin
  if not public.is_admin(true) then raise exception using errcode='42501', message='AAL2 administrator required'; end if;
  insert into public.trash_entries(entity_type,entity_id,snapshot,deleted_by) values(entity_type,entity_id,snapshot,auth.uid()) returning * into result;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id) values(auth.uid(),'MOVED_TO_TRASH',entity_type,entity_id);
  return result;
end $$;
create or replace function public.restore_from_trash(trash_id uuid) returns public.trash_entries language plpgsql security definer set search_path = '' as $$
declare result public.trash_entries;
begin
  if not public.is_admin(true) then raise exception using errcode='42501', message='AAL2 administrator required'; end if;
  update public.trash_entries set restored_at=now(),restored_by=auth.uid() where id=trash_id and restored_at is null returning * into result;
  if result.id is null then raise exception using errcode='P0001', message='RESTORE_NOT_ALLOWED'; end if;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id) values(auth.uid(),'RESTORED_FROM_TRASH',result.entity_type,result.entity_id);
  return result;
end $$;
create or replace function public.permanently_delete(trash_id uuid) returns void language plpgsql security definer set search_path = '' as $$
begin
  if public.is_admin(true) then insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(auth.uid(),'PERMANENT_DELETION_BLOCKED','trash_entry',trash_id::text,'{}'); end if;
  raise exception using errcode='42501', message='PERMANENT_DELETION_BLOCKED';
end $$;

revoke all on function public.create_service_request(uuid,uuid,text,timestamptz,numeric,text,uuid,boolean) from public;
grant execute on function public.create_service_request(uuid,uuid,text,timestamptz,numeric,text,uuid,boolean) to authenticated;
grant execute on all functions in schema public to authenticated;

-- ============================================================================
-- 3. Security, Realtime, Storage, and background jobs
-- Source: supabase/migrations/20260720000300_security_realtime_jobs.sql
-- ============================================================================

-- RLS, direct-access grants, private Storage, Realtime, and background jobs.
do $$ declare t text; begin
  foreach t in array array[
    'accounts','user_profiles','worker_profiles','admin_profiles','worker_verifications','worker_availability','service_categories','worker_skills','addresses',
    'ai_analyses','service_requests','request_media','match_candidates','bookings','booking_status_events','cancellations','location_updates',
    'payments','cash_confirmations','receipts','refunds','reviews','review_media','conversations','conversation_participants','messages',
    'message_attachments','message_translations','notifications','support_tickets','content_pages','system_settings','trash_entries','audit_logs',
    'report_exports','favorites','job_failures'
  ] loop execute format('alter table public.%I enable row level security', t); end loop;
end $$;

revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.service_categories, public.content_pages to anon;
grant select on all tables in schema public to authenticated;
grant update(display_name,avatar_path,notification_preferences) on public.user_profiles to authenticated;
grant update(display_name,avatar_path,bio,experience,service_area,latitude,longitude,is_available) on public.worker_profiles to authenticated;
grant insert, update, delete on public.worker_availability, public.worker_skills, public.addresses, public.favorites to authenticated;
grant insert on public.worker_verifications to authenticated;
grant update(identity_data,document_paths) on public.worker_verifications to authenticated;
grant insert on public.messages, public.message_attachments, public.support_tickets to authenticated;
grant update(read_at) on public.notifications to authenticated;

create policy accounts_self_or_admin_read on public.accounts for select to authenticated using(id=auth.uid() or public.is_admin(false));
create policy user_profile_self_or_admin_read on public.user_profiles for select to authenticated using(account_id=auth.uid() or public.is_admin(false));
create policy user_profile_self_update on public.user_profiles for update to authenticated using(account_id=auth.uid()) with check(account_id=auth.uid());
create policy worker_profile_discovery_read on public.worker_profiles for select to authenticated using(approval_status='APPROVED' or account_id=auth.uid() or public.is_admin(false));
create policy worker_profile_self_update on public.worker_profiles for update to authenticated using(account_id=auth.uid()) with check(account_id=auth.uid() and (approval_status='APPROVED' or not is_available));
create policy admin_profile_self_or_admin on public.admin_profiles for select to authenticated using(account_id=auth.uid() or public.is_admin(false));

create policy verification_owner_or_admin_read on public.worker_verifications for select to authenticated using(worker_id=auth.uid() or public.is_admin(false));
create policy verification_owner_insert on public.worker_verifications for insert to authenticated with check(worker_id=auth.uid() and public.current_role()='WORKER' and status='PENDING');
create policy verification_owner_pending_update on public.worker_verifications for update to authenticated using(worker_id=auth.uid() and status in ('PENDING','NEEDS_DOCUMENTS')) with check(worker_id=auth.uid() and status in ('PENDING','NEEDS_DOCUMENTS'));
create policy availability_read on public.worker_availability for select to authenticated using(true);
create policy availability_owner_write on public.worker_availability for all to authenticated using(worker_id=auth.uid()) with check(worker_id=auth.uid());
create policy categories_public_read on public.service_categories for select to anon, authenticated using(is_active or public.is_admin(false));
create policy skills_read on public.worker_skills for select to authenticated using(true);
create policy skills_owner_write on public.worker_skills for all to authenticated using(worker_id=auth.uid()) with check(worker_id=auth.uid());
create policy addresses_owner_or_admin_read on public.addresses for select to authenticated using(account_id=auth.uid() or public.is_admin(false));
create policy addresses_owner_write on public.addresses for all to authenticated using(account_id=auth.uid()) with check(account_id=auth.uid());

create policy analyses_owner_or_admin on public.ai_analyses for select to authenticated using(account_id=auth.uid() or public.is_admin(false));
create policy requests_authorized_read on public.service_requests for select to authenticated using(user_account_id=auth.uid() or selected_worker_id=auth.uid() or public.is_admin(false));
create policy request_media_authorized_read on public.request_media for select to authenticated using(exists(select 1 from public.service_requests r where r.id=service_request_id and (r.user_account_id=auth.uid() or r.selected_worker_id=auth.uid())) or public.is_admin(false));
create policy matches_authorized_read on public.match_candidates for select to authenticated using(worker_id=auth.uid() or exists(select 1 from public.service_requests r where r.id=service_request_id and r.user_account_id=auth.uid()) or public.is_admin(false));
create policy bookings_party_or_admin_read on public.bookings for select to authenticated using(public.is_booking_party(id));
create policy booking_events_party_or_admin_read on public.booking_status_events for select to authenticated using(public.is_booking_party(booking_id));
create policy cancellations_party_or_admin_read on public.cancellations for select to authenticated using(public.is_booking_party(booking_id));
create policy locations_party_or_admin_read on public.location_updates for select to authenticated using(public.is_booking_party(booking_id));

create policy payments_party_or_admin_read on public.payments for select to authenticated using(exists(select 1 from public.bookings b where b.id=booking_id and public.is_booking_party(b.id)));
create policy confirmations_party_or_admin_read on public.cash_confirmations for select to authenticated using(exists(select 1 from public.payments p where p.id=payment_id and public.is_booking_party(p.booking_id)));
create policy receipts_party_or_admin_read on public.receipts for select to authenticated using(exists(select 1 from public.payments p where p.id=payment_id and public.is_booking_party(p.booking_id)));
create policy refunds_party_or_admin_read on public.refunds for select to authenticated using(exists(select 1 from public.payments p where p.id=payment_id and public.is_booking_party(p.booking_id)));
create policy reviews_visible_read on public.reviews for select to authenticated using(moderation_status='PUBLISHED' or user_account_id=auth.uid() or worker_account_id=auth.uid() or public.is_admin(false));
create policy review_media_visible_read on public.review_media for select to authenticated using(exists(select 1 from public.reviews r where r.id=review_id and (r.moderation_status='PUBLISHED' or r.user_account_id=auth.uid() or r.worker_account_id=auth.uid())) or public.is_admin(false));

create policy conversations_member_read on public.conversations for select to authenticated using(public.is_conversation_participant(id));
create policy participants_member_read on public.conversation_participants for select to authenticated using(public.is_conversation_participant(conversation_id));
create policy messages_member_read on public.messages for select to authenticated using(public.is_conversation_participant(conversation_id));
create policy messages_member_insert on public.messages for insert to authenticated with check(sender_id=auth.uid() and public.is_conversation_participant(conversation_id));
create policy attachments_member_read on public.message_attachments for select to authenticated using(exists(select 1 from public.messages m where m.id=message_id and public.is_conversation_participant(m.conversation_id)));
create policy attachments_sender_insert on public.message_attachments for insert to authenticated with check(exists(select 1 from public.messages m where m.id=message_id and m.sender_id=auth.uid() and public.is_conversation_participant(m.conversation_id)));
create policy translations_member_read on public.message_translations for select to authenticated using(exists(select 1 from public.messages m where m.id=message_id and public.is_conversation_participant(m.conversation_id)));

create policy notifications_recipient_read on public.notifications for select to authenticated using(recipient_id=auth.uid() or (audience='EVERYONE') or (audience='USERS' and public.current_role()='USER') or (audience='WORKERS' and public.current_role()='WORKER') or public.is_admin(false));
create policy notifications_recipient_update on public.notifications for update to authenticated using(recipient_id=auth.uid()) with check(recipient_id=auth.uid());
create policy tickets_owner_or_admin_read on public.support_tickets for select to authenticated using(owner_id=auth.uid() or public.is_admin(false));
create policy tickets_owner_insert on public.support_tickets for insert to authenticated with check(owner_id=auth.uid());
create policy content_published_read on public.content_pages for select to anon, authenticated using(published_at is not null or public.is_admin(false));
create policy settings_admin_read on public.system_settings for select to authenticated using(public.is_admin(false));
create policy trash_admin_read on public.trash_entries for select to authenticated using(public.is_admin(true));
create policy audit_admin_read on public.audit_logs for select to authenticated using(public.is_admin(true));
create policy exports_admin_read on public.report_exports for select to authenticated using(public.is_admin(true));
create policy favorites_owner_read on public.favorites for select to authenticated using(user_account_id=auth.uid());
create policy favorites_owner_write on public.favorites for all to authenticated using(user_account_id=auth.uid()) with check(user_account_id=auth.uid());
create policy job_failures_admin_read on public.job_failures for select to authenticated using(public.is_admin(true));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('request-media','request-media',false,15728640,array['image/jpeg','image/png','image/webp']),
 ('verification-documents','verification-documents',false,15728640,array['image/jpeg','image/png','application/pdf']),
 ('message-attachments','message-attachments',false,15728640,array['image/jpeg','image/png','image/webp','audio/mpeg','audio/mp4','audio/wav']),
 ('review-media','review-media',false,15728640,array['image/jpeg','image/png','image/webp']),
 ('profile-images','profile-images',false,5242880,array['image/jpeg','image/png','image/webp']),
 ('report-exports','report-exports',false,52428800,array['text/csv','application/pdf','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy storage_owner_upload on storage.objects for insert to authenticated with check(bucket_id in ('request-media','verification-documents','message-attachments','review-media','profile-images') and (storage.foldername(name))[1]=auth.uid()::text);
create policy storage_owner_update on storage.objects for update to authenticated using(owner_id=auth.uid()::text) with check(owner_id=auth.uid()::text);
create policy storage_owner_delete on storage.objects for delete to authenticated using(owner_id=auth.uid()::text);
create policy storage_authorized_read on storage.objects for select to authenticated using(
  owner_id=auth.uid()::text
  or public.is_admin(false)
  or (bucket_id='message-attachments' and exists(
    select 1 from public.message_attachments a join public.messages m on m.id=a.message_id
    where a.storage_path=name and public.is_conversation_participant(m.conversation_id)
  ))
  or (bucket_id='request-media' and exists(
    select 1 from public.request_media rm join public.service_requests sr on sr.id=rm.service_request_id
    where rm.storage_path=name and (sr.user_account_id=auth.uid() or sr.selected_worker_id=auth.uid())
  ))
  or (bucket_id='review-media' and exists(
    select 1 from public.review_media media join public.reviews review on review.id=media.review_id
    where media.storage_path=name and (review.user_account_id=auth.uid() or (review.worker_account_id=auth.uid() and review.moderation_status='PUBLISHED'))
  ))
);
create policy report_exports_admin_storage on storage.objects for all to authenticated using(bucket_id='report-exports' and public.is_admin(true)) with check(bucket_id='report-exports' and public.is_admin(true));

-- Supabase owns and already enables RLS on realtime.messages. Hosted projects
-- allow application policies here but reject ALTER TABLE ownership operations.
create policy realtime_booking_read on realtime.messages for select to authenticated using(
  extension='broadcast' and split_part(realtime.topic(),':',1)='booking' and public.is_booking_party(split_part(realtime.topic(),':',2)::uuid)
);
create policy realtime_conversation_read on realtime.messages for select to authenticated using(
  extension='broadcast' and split_part(realtime.topic(),':',1)='conversation' and public.is_conversation_participant(split_part(realtime.topic(),':',2)::uuid)
);
create policy realtime_notification_read on realtime.messages for select to authenticated using(
  extension='broadcast' and realtime.topic()='user:'||auth.uid()::text||':notifications'
);

create or replace function public.broadcast_application_change() returns trigger language plpgsql security definer set search_path='' as $$
declare topic text;
begin
  if tg_table_name='bookings' then topic := 'booking:'||new.id::text||':status';
  elsif tg_table_name='location_updates' then topic := 'booking:'||new.booking_id::text||':location';
  elsif tg_table_name='messages' then topic := 'conversation:'||new.conversation_id::text||':messages';
  elsif tg_table_name='notifications' and new.recipient_id is not null then topic := 'user:'||new.recipient_id::text||':notifications';
  end if;
  if topic is not null then perform realtime.broadcast_changes(topic,tg_op,tg_op,tg_table_name,tg_table_schema,new,old); end if;
  return coalesce(new,old);
end $$;
create trigger broadcast_booking_change after insert or update on public.bookings for each row execute function public.broadcast_application_change();
create trigger broadcast_location_change after insert on public.location_updates for each row execute function public.broadcast_application_change();
create trigger broadcast_message_change after insert on public.messages for each row execute function public.broadcast_application_change();
create trigger broadcast_notification_change after insert or update on public.notifications for each row execute function public.broadcast_application_change();

select pgmq.create('booking_timeouts');
select pgmq.create('no_match_notifications');
select pgmq.create('scheduled_notifications');
select pgmq.create('provider_work');

create or replace function private.invoke_queue_consumer() returns void language plpgsql security definer set search_path='' as $$
declare project_url text; invocation_secret text;
begin
  select decrypted_secret into project_url from vault.decrypted_secrets where name='project_url' limit 1;
  select decrypted_secret into invocation_secret from vault.decrypted_secrets where name='queue_consumer_secret' limit 1;
  if project_url is null or invocation_secret is null then return; end if;
  perform net.http_post(url:=project_url||'/functions/v1/queue-consumer',headers:=jsonb_build_object('content-type','application/json','x-ayos-queue-secret',invocation_secret),body:='{}'::jsonb,timeout_milliseconds:=10000);
end $$;
select cron.schedule('ayos-queue-consumer','* * * * *','select private.invoke_queue_consumer()');

-- ============================================================================
-- 4. Administrator and queue RPCs
-- Source: supabase/migrations/20260720000400_admin_and_queue_rpcs.sql
-- ============================================================================

alter table public.booking_status_events alter column actor_id drop not null;

create or replace function public.admin_upsert_content(content_key public.content_key, title text, body text, version text, publish boolean)
returns public.content_pages language plpgsql security definer set search_path='' as $$
declare result public.content_pages;
begin
  if not public.is_admin(true) then raise exception using errcode='42501',message='AAL2 administrator required'; end if;
  insert into public.content_pages(key,title,body,version,published_at,updated_by)
  values(content_key,trim(title),body,trim(version),case when publish then now() else null end,auth.uid())
  on conflict(key) do update set title=excluded.title,body=excluded.body,version=excluded.version,published_at=excluded.published_at,updated_by=auth.uid()
  returning * into result;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id) values(auth.uid(),'CONTENT_UPDATED','content_page',result.id::text);
  return result;
end $$;

create or replace function public.set_admin_mfa_enabled(enabled boolean) returns public.accounts language plpgsql security definer set search_path='' as $$
declare result public.accounts;
begin
  if public.current_role() <> 'ADMIN' or coalesce(auth.jwt()->>'aal','aal1') <> 'aal2' then raise exception using errcode='42501',message='AAL2 administrator required'; end if;
  update public.accounts set mfa_enabled=enabled where id=auth.uid() returning * into result;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(auth.uid(),'ADMIN_MFA_CHANGED','account',auth.uid()::text,jsonb_build_object('enabled',enabled));
  return result;
end $$;

create or replace function public.admin_set_setting(setting_key text, setting_value jsonb)
returns public.system_settings language plpgsql security definer set search_path='' as $$
declare result public.system_settings;
begin
  if not public.is_admin(true) then raise exception using errcode='42501',message='AAL2 administrator required'; end if;
  insert into public.system_settings(key,value,updated_by) values(setting_key,setting_value,auth.uid())
  on conflict(key) do update set value=excluded.value,updated_by=auth.uid(),updated_at=now() returning * into result;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id) values(auth.uid(),'SETTING_UPDATED','system_setting',setting_key);
  return result;
end $$;

create or replace function public.moderate_review(review_id uuid, decision public.review_moderation_status)
returns public.reviews language plpgsql security definer set search_path='' as $$
declare result public.reviews;
begin
  if not public.is_admin(true) or decision not in ('PUBLISHED','REJECTED') then raise exception using errcode='42501',message='AAL2 administrator required'; end if;
  update public.reviews set moderation_status=decision,moderated_by=auth.uid(),moderated_at=now() where id=review_id returning * into result;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(auth.uid(),'REVIEW_MODERATED','review',review_id::text,jsonb_build_object('decision',decision));
  return result;
end $$;

create or replace function public.update_support_ticket(p_ticket_id uuid, p_next_status public.ticket_status, p_resolution text default null)
returns public.support_tickets language plpgsql security definer set search_path='' as $$
declare result public.support_tickets;
begin
  if not public.is_admin(true) then raise exception using errcode='42501',message='AAL2 administrator required'; end if;
  update public.support_tickets t set status=p_next_status,resolution=p_resolution,
    escalated_at=case when p_next_status='ESCALATED' then now() else t.escalated_at end,
    resolved_at=case when p_next_status='RESOLVED' then now() else t.resolved_at end,
    closed_at=case when p_next_status='CLOSED' then now() else t.closed_at end
  where t.id=p_ticket_id returning * into result;
  return result;
end $$;

create or replace function public.read_job_batch(queue_name text, visibility_seconds integer default 60, batch_size integer default 10)
returns setof jsonb language plpgsql security definer set search_path='' as $$
begin
  if auth.role() <> 'service_role' then raise exception using errcode='42501',message='Service role required'; end if;
  return query execute format('select to_jsonb(x) from pgmq.read(%L,%s,%s) x',queue_name,greatest(visibility_seconds,10),least(greatest(batch_size,1),100));
end $$;
create or replace function public.archive_job(queue_name text, message_id bigint) returns boolean language plpgsql security definer set search_path='' as $$
declare archived boolean;
begin
  if auth.role() <> 'service_role' then raise exception using errcode='42501',message='Service role required'; end if;
  execute format('select pgmq.archive(%L,%s)',queue_name,message_id) into archived; return archived;
end $$;
create or replace function public.expire_booking_request(target_booking uuid) returns boolean language plpgsql security definer set search_path='' as $$
declare booking public.bookings;
begin
  if auth.role() <> 'service_role' then raise exception using errcode='42501',message='Service role required'; end if;
  select * into booking from public.bookings where id=target_booking for update;
  if booking.status <> 'PENDING' or booking.response_due_at > now() then return false; end if;
  update public.bookings set status='CANCELLED',cancelled_at=now(),version=version+1 where id=booking.id;
  insert into public.booking_status_events(booking_id,from_status,to_status,reason) values(booking.id,'PENDING','CANCELLED','Booking response timed out');
  update public.service_requests set status='OPEN',selected_worker_id=null,notify_on_match=true where id=booking.service_request_id;
  insert into public.notifications(recipient_id,title,body,category,status,sent_at) values(booking.user_account_id,'Worker response timed out','Choose another recommended worker.','BOOKING','SENT',now());
  return true;
end $$;

revoke execute on function public.read_job_batch(text,integer,integer), public.archive_job(text,bigint), public.expire_booking_request(uuid) from public, anon, authenticated;
grant execute on function public.read_job_batch(text,integer,integer), public.archive_job(text,bigint), public.expire_booking_request(uuid) to service_role;
grant execute on function public.admin_upsert_content(public.content_key,text,text,text,boolean), public.admin_set_setting(text,jsonb), public.moderate_review(uuid,public.review_moderation_status), public.update_support_ticket(uuid,public.ticket_status,text), public.set_admin_mfa_enabled(boolean) to authenticated;

-- PostgreSQL grants function execution to PUBLIC by default. Remove that implicit
-- access so exposed RPCs are callable only by roles granted explicitly above or
-- by the authenticated grants established in the domain migration.
revoke execute on all functions in schema public from public, anon;
grant execute on function public.is_admin(boolean), public.current_role() to anon;

-- ============================================================================
-- 5. PostGIS geospatial and AI support
-- Source: supabase/migrations/20260720000500_geospatial_ai.sql
-- ============================================================================

-- PostGIS-backed discovery/tracking and AI provider auditability.
-- FR-10–FR-13, FR-33–FR-44, FR-77, FR-92–FR-98; NFR-04–NFR-18.
create extension if not exists postgis with schema extensions;

alter table public.worker_profiles
  drop column latitude,
  drop column longitude,
  add column service_origin extensions.geography(point, 4326),
  add column service_radius_meters integer check (service_radius_meters between 100 and 200000),
  add column latitude numeric(9,6) generated always as
    (round(extensions.st_y(service_origin::extensions.geometry)::numeric, 6)) stored,
  add column longitude numeric(9,6) generated always as
    (round(extensions.st_x(service_origin::extensions.geometry)::numeric, 6)) stored;

alter table public.addresses
  drop column latitude,
  drop column longitude,
  add column location extensions.geography(point, 4326),
  add column latitude numeric(9,6) generated always as
    (round(extensions.st_y(location::extensions.geometry)::numeric, 6)) stored,
  add column longitude numeric(9,6) generated always as
    (round(extensions.st_x(location::extensions.geometry)::numeric, 6)) stored;

alter table public.service_requests
  add column service_location extensions.geography(point, 4326) not null;

alter table public.location_updates
  drop column latitude,
  drop column longitude,
  add column location extensions.geography(point, 4326) not null,
  add column latitude numeric(9,6) generated always as
    (round(extensions.st_y(location::extensions.geometry)::numeric, 6)) stored,
  add column longitude numeric(9,6) generated always as
    (round(extensions.st_x(location::extensions.geometry)::numeric, 6)) stored;

create index worker_profiles_service_origin_gix on public.worker_profiles using gist(service_origin);
create index addresses_location_gix on public.addresses using gist(location);
create index service_requests_location_gix on public.service_requests using gist(service_location);
create index location_updates_location_gix on public.location_updates using gist(location);

alter table public.ai_analyses
  add column provider_model text,
  add column idempotency_key text,
  add column request_draft text,
  add constraint ai_analyses_idempotency_key_check
    check (idempotency_key is null or length(idempotency_key) between 16 and 128),
  add constraint ai_analyses_cost_range_check
    check (
      estimated_cost_minimum is null
      or estimated_cost_maximum is null
      or estimated_cost_minimum <= estimated_cost_maximum
    );
create unique index ai_analyses_account_idempotency_idx
  on public.ai_analyses(account_id, idempotency_key) where idempotency_key is not null;

create table public.ai_analysis_attempts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete restrict,
  analysis_id uuid references public.ai_analyses(id) on delete set null,
  idempotency_key text not null check (length(idempotency_key) between 16 and 128),
  provider text not null check (provider in ('OPENAI','GEMINI','OPENROUTER')),
  model text not null,
  outcome text not null check (outcome in ('SUCCEEDED','FAILED','SKIPPED')),
  retryable boolean not null,
  latency_ms integer not null check (latency_ms >= 0),
  error_code text,
  created_at timestamptz not null default now()
);
create index ai_analysis_attempts_account_time_idx
  on public.ai_analysis_attempts(account_id, created_at desc);
create unique index ai_analysis_attempts_idempotent_idx
  on public.ai_analysis_attempts(account_id, idempotency_key, provider, model, outcome);
alter table public.ai_analysis_attempts enable row level security;
revoke all on public.ai_analysis_attempts from anon, authenticated;
grant select on public.ai_analysis_attempts to authenticated;
create policy ai_attempts_owner_or_admin_read on public.ai_analysis_attempts
  for select to authenticated
  using (account_id = auth.uid() or public.is_admin(false));

create or replace function public.persist_ai_analysis(
  p_account_id uuid, p_input_type text, p_input_storage_path text, p_transcript text,
  p_idempotency_key text, p_provider text, p_model text, p_provider_reference text,
  p_result jsonb, p_attempts jsonb
) returns public.ai_analyses
language plpgsql security definer set search_path = '' as $$
declare result public.ai_analyses;
begin
  if auth.role() <> 'service_role' then
    raise exception using errcode='42501', message='SERVICE_ROLE_REQUIRED';
  end if;
  if p_input_type not in ('TEXT','IMAGE','VOICE')
    or p_provider not in ('OPENAI','GEMINI','OPENROUTER')
    or length(p_idempotency_key) not between 16 and 128 then
    raise exception using errcode='22023', message='INVALID_AI_ANALYSIS';
  end if;
  insert into public.ai_analyses(
    account_id,input_type,input_storage_path,transcript,detected_issue,severity,
    possible_cause,suggested_category_name,estimated_cost_minimum,
    estimated_cost_maximum,safety_advice,request_draft,provider,provider_model,
    provider_reference,idempotency_key
  ) values (
    p_account_id,p_input_type,p_input_storage_path,p_transcript,
    p_result->>'detectedIssue',p_result->>'severity',p_result->>'possibleCause',
    p_result->>'suggestedCategory',(p_result->>'estimatedCostMinimum')::numeric,
    (p_result->>'estimatedCostMaximum')::numeric,p_result->>'safetyAdvice',
    p_result->>'requestDraft',p_provider,p_model,p_provider_reference,p_idempotency_key
  )
  on conflict(account_id,idempotency_key) where idempotency_key is not null
    do update set id=public.ai_analyses.id
  returning * into result;

  insert into public.ai_analysis_attempts(
    account_id,analysis_id,idempotency_key,provider,model,outcome,retryable,
    latency_ms,error_code
  )
  select p_account_id,result.id,p_idempotency_key,attempt.provider,attempt.model,
    attempt.outcome,attempt.retryable,attempt.latency_ms,attempt.error_code
  from jsonb_to_recordset(p_attempts) as attempt(
    provider text, model text, outcome text, retryable boolean,
    latency_ms integer, error_code text
  )
  on conflict(account_id,idempotency_key,provider,model,outcome) do nothing;
  return result;
end $$;

revoke execute on function public.persist_ai_analysis(uuid,text,text,text,text,text,text,text,jsonb,jsonb)
  from public, anon, authenticated;
grant execute on function public.persist_ai_analysis(uuid,text,text,text,text,text,text,text,jsonb,jsonb)
  to service_role;

create or replace function private.make_location(p_latitude numeric, p_longitude numeric)
returns extensions.geography
language plpgsql immutable set search_path = '' as $$
begin
  if p_latitude is null or p_longitude is null
    or p_latitude not between -90 and 90
    or p_longitude not between -180 and 180 then
    raise exception using errcode='22023', message='INVALID_COORDINATES';
  end if;
  return extensions.st_setsrid(extensions.st_makepoint(p_longitude, p_latitude), 4326)::extensions.geography;
end $$;

create or replace function public.set_address_location(
  p_address_id uuid,
  p_latitude numeric,
  p_longitude numeric
) returns public.addresses
language plpgsql security definer set search_path = '' as $$
declare result public.addresses;
begin
  update public.addresses
  set location = private.make_location(p_latitude, p_longitude)
  where id = p_address_id and account_id = auth.uid()
  returning * into result;
  if result.id is null then
    raise exception using errcode='42501', message='ADDRESS_UNAVAILABLE';
  end if;
  return result;
end $$;

create or replace function public.set_worker_service_area(
  p_latitude numeric,
  p_longitude numeric,
  p_radius_meters integer
) returns public.worker_profiles
language plpgsql security definer set search_path = '' as $$
declare result public.worker_profiles;
begin
  if public.current_role() <> 'WORKER' then
    raise exception using errcode='42501', message='WORKER_ROLE_REQUIRED';
  end if;
  if p_radius_meters not between 100 and 200000 then
    raise exception using errcode='22023', message='INVALID_SERVICE_RADIUS';
  end if;
  update public.worker_profiles
  set service_origin = private.make_location(p_latitude, p_longitude),
      service_radius_meters = p_radius_meters
  where account_id = auth.uid()
  returning * into result;
  return result;
end $$;

create or replace function public.create_service_request(
  category_id uuid, address_id uuid, description text, scheduled_at timestamptz,
  budget numeric, notes text default null, ai_analysis_id uuid default null,
  notify_on_match boolean default false
) returns public.service_requests
language plpgsql security definer set search_path = '' as $$
declare result public.service_requests; address_location extensions.geography;
begin
  if public.current_role() <> 'USER' then raise exception using errcode='42501', message='USER role required'; end if;
  if not exists(select 1 from public.content_pages where key='TERMS' and published_at is not null) then
    raise exception using errcode='P0001', message='CONTENT_NOT_CONFIGURED';
  end if;
  select location into address_location from public.addresses
    where id = address_id and account_id = auth.uid();
  if address_location is null then raise exception using errcode='22023', message='ADDRESS_LOCATION_REQUIRED'; end if;
  if ai_analysis_id is not null and not exists(
    select 1 from public.ai_analyses where id=ai_analysis_id and account_id=auth.uid()
  ) then raise exception using errcode='42501', message='AI_ANALYSIS_UNAVAILABLE'; end if;
  if scheduled_at <= now() or budget <= 0 or length(trim(description)) not between 10 and 4000 then
    raise exception using errcode='22023', message='Invalid service request';
  end if;
  insert into public.service_requests(
    user_account_id, category_id, address_id, service_location, description,
    scheduled_at, budget, notes, ai_analysis_id, notify_on_match, status
  ) values(
    auth.uid(), category_id, address_id, address_location, trim(description),
    scheduled_at, round(budget,2), nullif(trim(notes),''), ai_analysis_id, notify_on_match, 'OPEN'
  ) returning * into result;
  return result;
end $$;

create or replace function public.generate_matches(p_service_request_id uuid)
returns setof public.match_candidates
language plpgsql security definer set search_path = '' as $$
declare request public.service_requests; matched_count integer;
begin
  select * into request from public.service_requests where id=p_service_request_id for update;
  if request.user_account_id is distinct from auth.uid() or request.status not in ('OPEN','MATCHED') then
    raise exception using errcode='42501',message='Service request unavailable';
  end if;
  delete from public.match_candidates where service_request_id=request.id;
  insert into public.match_candidates(service_request_id,worker_id,score,rank,factors,eligible)
  with eligible as (
    select wp.account_id worker_id, ws.years,
      coalesce(avg(r.stars) filter(where r.moderation_status='PUBLISHED'),0)::numeric(3,2) rating,
      wp.recommendation_priority,
      extensions.st_distance(wp.service_origin, request.service_location)::numeric(12,2) distance_meters,
      (ws.years*5 + coalesce(avg(r.stars) filter(where r.moderation_status='PUBLISHED'),0)*10)::numeric(7,4) suitability_score
    from public.worker_profiles wp
    join public.worker_skills ws on ws.worker_id=wp.account_id
    left join public.reviews r on r.worker_account_id=wp.account_id
    where ws.category_id=request.category_id
      and wp.approval_status='APPROVED' and wp.is_available
      and wp.service_origin is not null and wp.service_radius_meters is not null
      and extensions.st_dwithin(wp.service_origin, request.service_location, wp.service_radius_meters)
      and exists(
        select 1 from public.worker_availability wa
        where wa.worker_id=wp.account_id
          and wa.day_of_week=extract(dow from request.scheduled_at)::integer
          and request.scheduled_at::time between wa.start_time and wa.end_time
      )
    group by wp.account_id,ws.years,wp.recommendation_priority,wp.service_origin,wp.service_radius_meters
  ), ranked as (
    select *, row_number() over(
      order by suitability_score desc, distance_meters asc, recommendation_priority desc, worker_id
    )::integer as candidate_rank
    from eligible
  )
  select request.id, worker_id, suitability_score, candidate_rank,
    jsonb_build_object(
      'category',true,'available',true,'years',years,'rating',rating,
      'distance_meters',distance_meters,'recommendation_priority',recommendation_priority
    ), true
  from ranked where candidate_rank <= 5;
  get diagnostics matched_count=row_count;
  if matched_count>0 then update public.service_requests set status='MATCHED' where id=request.id;
  else perform pgmq.send('no_match_notifications',jsonb_build_object('service_request_id',request.id,'user_account_id',request.user_account_id),300); end if;
  return query select * from public.match_candidates
    where service_request_id=request.id order by rank;
end $$;

create or replace function public.select_worker(p_service_request_id uuid, p_worker_id uuid)
returns public.bookings
language plpgsql security definer set search_path = '' as $$
declare request public.service_requests; result public.bookings; conversation_id uuid;
begin
  select * into request from public.service_requests where id = p_service_request_id for update;
  if request.user_account_id is distinct from auth.uid() or request.status not in ('OPEN','MATCHED') then
    raise exception using errcode='42501', message='Service request cannot be selected';
  end if;
  if not exists(
    select 1 from public.worker_profiles wp
    join public.worker_skills ws on ws.worker_id=wp.account_id
    where wp.account_id=p_worker_id and wp.approval_status='APPROVED' and wp.is_available
      and ws.category_id=request.category_id
      and wp.service_origin is not null and wp.service_radius_meters is not null
      and extensions.st_dwithin(wp.service_origin, request.service_location, wp.service_radius_meters)
  ) then raise exception using errcode='P0001', message='WORKER_UNAVAILABLE'; end if;
  insert into public.bookings(service_request_id,user_account_id,worker_account_id)
    values(request.id,auth.uid(),p_worker_id) returning * into result;
  insert into public.booking_status_events(booking_id,to_status,actor_id)
    values(result.id,'PENDING',auth.uid());
  insert into public.conversations(booking_id) values(result.id) returning id into conversation_id;
  insert into public.conversation_participants(conversation_id,account_id)
    values(conversation_id,auth.uid()),(conversation_id,p_worker_id);
  update public.service_requests set status='BOOKED', selected_worker_id=p_worker_id where id=request.id;
  perform pgmq.send('booking_timeouts', jsonb_build_object('booking_id',result.id,'due_at',result.response_due_at,'attempt',0));
  return result;
end $$;

create or replace function public.record_worker_location(
  booking_id uuid,
  latitude numeric,
  longitude numeric
) returns public.location_updates
language plpgsql security definer set search_path = '' as $$
declare booking public.bookings; result public.location_updates;
begin
  select * into booking from public.bookings where id=booking_id;
  if booking.worker_account_id is distinct from auth.uid()
    or booking.status not in ('WORKER_EN_ROUTE','WORKER_ARRIVED','SERVICE_STARTED','IN_PROGRESS') then
    raise exception using errcode='42501', message='Location update not allowed';
  end if;
  insert into public.location_updates(booking_id,account_id,location)
    values(booking.id,auth.uid(),private.make_location(latitude,longitude)) returning * into result;
  return result;
end $$;

create or replace function public.get_booking_tracking(p_booking_id uuid, p_limit integer default 100)
returns table(latitude numeric, longitude numeric, recorded_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_booking_party(p_booking_id) then
    raise exception using errcode='42501', message='BOOKING_LOCATION_UNAVAILABLE';
  end if;
  return query
    select updates.latitude, updates.longitude, updates.recorded_at
    from public.location_updates updates
    where updates.booking_id=p_booking_id
    order by updates.recorded_at desc
    limit least(greatest(p_limit,1),250);
end $$;

revoke execute on function private.make_location(numeric,numeric) from public, anon, authenticated;
revoke execute on function public.set_address_location(uuid,numeric,numeric),
  public.set_worker_service_area(numeric,numeric,integer),
  public.get_booking_tracking(uuid,integer) from public, anon;
grant execute on function public.set_address_location(uuid,numeric,numeric),
  public.set_worker_service_area(numeric,numeric,integer),
  public.get_booking_tracking(uuid,integer) to authenticated;

-- ============================================================================
-- 6. Secure administrator bootstrap
-- Source: supabase/migrations/20260720000600_secure_admin_bootstrap.sql
-- ============================================================================

-- Secure, one-time administrator bootstrap. FR-19, NFR-04, NFR-06.

create table if not exists private.admin_bootstrap_requests (
  email text primary key check (email = lower(btrim(email)) and length(email) between 3 and 254),
  token_hash text not null check (token_hash ~ '^[0-9a-f]{64}$'),
  display_name text not null check (length(display_name) between 2 and 120),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (expires_at > created_at and expires_at <= created_at + interval '10 minutes')
);
revoke all on private.admin_bootstrap_requests from public, anon, authenticated, service_role;

create or replace function public.prepare_admin_bootstrap(
  email text,
  token_hash text,
  display_name text,
  expires_at timestamptz
) returns void
language plpgsql security definer set search_path = '' as $$
declare
  normalized_email text := lower(btrim(email));
  normalized_name text := btrim(display_name);
begin
  if auth.role() <> 'service_role' then
    raise exception using errcode = '42501', message = 'SERVICE_ROLE_REQUIRED';
  end if;
  if normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
     or length(normalized_email) > 254 then
    raise exception using errcode = '22023', message = 'INVALID_ADMIN_EMAIL';
  end if;
  if token_hash !~ '^[0-9a-f]{64}$' then
    raise exception using errcode = '22023', message = 'INVALID_BOOTSTRAP_TOKEN_HASH';
  end if;
  if length(normalized_name) not between 2 and 120 then
    raise exception using errcode = '22023', message = 'INVALID_ADMIN_DISPLAY_NAME';
  end if;
  if expires_at <= now() or expires_at > now() + interval '10 minutes' then
    raise exception using errcode = '22023', message = 'INVALID_BOOTSTRAP_EXPIRATION';
  end if;
  if exists(select 1 from auth.users where lower(auth.users.email) = normalized_email)
     or exists(select 1 from public.accounts where lower(accounts.email) = normalized_email) then
    raise exception using errcode = '23505', message = 'ADMIN_ACCOUNT_ALREADY_EXISTS';
  end if;

  insert into private.admin_bootstrap_requests(email, token_hash, display_name, expires_at)
  values(normalized_email, token_hash, normalized_name, expires_at)
  on conflict on constraint admin_bootstrap_requests_pkey do update
    set token_hash = excluded.token_hash,
        display_name = excluded.display_name,
        expires_at = excluded.expires_at,
        created_at = now();
end
$$;

create or replace function public.cancel_admin_bootstrap(email text, token_hash text)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.role() <> 'service_role' then
    raise exception using errcode = '42501', message = 'SERVICE_ROLE_REQUIRED';
  end if;
  delete from private.admin_bootstrap_requests request
  where request.email = lower(btrim($1))
    and request.token_hash = $2;
end
$$;

create or replace function public.admin_bootstrap_status(email text)
returns jsonb
language sql stable security definer set search_path = '' as $$
  select case when auth.role() = 'service_role' then jsonb_build_object(
    'auth_user_id', auth_user.id,
    'auth_user_exists', auth_user.id is not null,
    'account_exists', account.id is not null,
    'admin_profile_exists', admin_profile.account_id is not null,
    'app_role', auth_user.raw_app_meta_data->>'ayos_role',
    'account_is_admin', coalesce(account.role = 'ADMIN', false),
    'account_is_active', coalesce(account.status = 'ACTIVE' and account.deleted_at is null, false),
    'account_is_protected', coalesce(account.is_protected, false),
    'bootstrap_token_present', coalesce(auth_user.raw_user_meta_data->>'admin_bootstrap_token', '') <> '',
    'fully_bootstrapped', coalesce(
      account.role = 'ADMIN'
      and account.status = 'ACTIVE'
      and account.is_protected
      and account.deleted_at is null
      and admin_profile.account_id is not null
      and auth_user.raw_app_meta_data->>'ayos_role' = 'ADMIN',
      false
    ) and not (
      coalesce(auth_user.raw_user_meta_data->>'admin_bootstrap_token', '') <> ''
    )
  ) else null end
  from (select lower(btrim(email)) as normalized_email) input
  left join auth.users auth_user on lower(auth_user.email) = input.normalized_email
  left join public.accounts account on account.id = auth_user.id
  left join public.admin_profiles admin_profile on admin_profile.account_id = auth_user.id
$$;

create or replace function public.provision_account()
returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  requested_role public.account_role;
  display_name text;
  mobile_value text;
  bootstrap_token text;
  bootstrap_request private.admin_bootstrap_requests;
begin
  bootstrap_token := nullif(new.raw_user_meta_data->>'admin_bootstrap_token', '');
  if bootstrap_token is not null then
    delete from private.admin_bootstrap_requests request
    where request.email = lower(new.email)
      and request.token_hash = encode(extensions.digest(bootstrap_token, 'sha256'), 'hex')
      and request.expires_at > now()
    returning * into bootstrap_request;
  end if;

  if bootstrap_request.email is not null then
    requested_role := 'ADMIN';
    display_name := bootstrap_request.display_name;
  else
    begin
      requested_role := upper(coalesce(new.raw_user_meta_data->>'role', ''))::public.account_role;
    exception when invalid_text_representation then
      raise exception using errcode = '42501', message = 'Invalid account role';
    end;
    if requested_role = 'ADMIN' then
      raise exception using errcode = '42501', message = 'Administrator self-registration is prohibited';
    end if;
    if requested_role not in ('USER', 'WORKER') then
      raise exception using errcode = '42501', message = 'Invalid account role';
    end if;
    if not exists(
      select 1 from public.content_pages where key = 'TERMS' and published_at is not null
    ) then
      raise exception using errcode = 'P0001', message = 'Registration is unavailable until Terms are published';
    end if;
    display_name := btrim(coalesce(new.raw_user_meta_data->>'name', ''));
  end if;

  mobile_value := nullif(btrim(coalesce(new.raw_user_meta_data->>'mobile', '')), '');
  if length(display_name) < 2 then
    raise exception using errcode = '22023', message = 'A valid display name is required';
  end if;

  insert into public.accounts(id, role, status, email, mobile, is_protected)
  values(
    new.id,
    requested_role,
    case when requested_role = 'ADMIN' or new.email_confirmed_at is not null
      then 'ACTIVE'::public.account_status
      else 'PENDING_VERIFICATION'::public.account_status
    end,
    lower(new.email),
    mobile_value,
    requested_role = 'ADMIN'
  );
  if requested_role = 'USER' then
    insert into public.user_profiles(account_id, display_name) values(new.id, display_name);
  elsif requested_role = 'WORKER' then
    insert into public.worker_profiles(account_id, display_name) values(new.id, display_name);
  else
    insert into public.admin_profiles(account_id, display_name) values(new.id, display_name);
  end if;
  return new;
end
$$;

revoke execute on function public.prepare_admin_bootstrap(text,text,text,timestamptz),
  public.cancel_admin_bootstrap(text,text),
  public.admin_bootstrap_status(text) from public, anon, authenticated;
grant execute on function public.prepare_admin_bootstrap(text,text,text,timestamptz),
  public.cancel_admin_bootstrap(text,text),
  public.admin_bootstrap_status(text) to service_role;

-- ============================================================================
-- 7. Development seed data
-- Source: supabase/seed.sql
-- ============================================================================

insert into public.content_pages (key, title, body, version, published_at)
values
  ('TERMS', 'Terms of Service', 'Local development terms. Replace before production.', 'local-1', now()),
  ('PRIVACY', 'Privacy Policy', 'Local development privacy policy. Replace before production.', 'local-1', now()),
  ('REFUND_POLICY', 'Refund Policy', 'Local development refund policy. Replace before production.', 'local-1', now()),
  ('HELP_CENTER', 'Help Center', 'Local development help content. Replace before production.', 'local-1', now())
on conflict (key) do update set title = excluded.title, body = excluded.body, version = excluded.version;

insert into public.service_categories (name, description)
values
  ('Plumbing', 'Plumbing repair and installation'),
  ('Electrical', 'Electrical repair and installation'),
  ('Cleaning', 'Home and property cleaning')
on conflict (name) do nothing;

commit;

-- ============================================================================
-- Installation verification (read-only)
-- ============================================================================

-- Required extensions and their schemas.
select extension_record.extname as extension_name,
       namespace_record.nspname as installed_schema,
       extension_record.extversion as version
from pg_extension extension_record
join pg_namespace namespace_record
  on namespace_record.oid = extension_record.extnamespace
where extension_record.extname in (
  'pgcrypto', 'pgmq', 'pg_cron', 'pg_net', 'supabase_vault', 'postgis'
)
order by extension_record.extname;

-- Every exposed A-YOS table and its RLS/forced-RLS state.
select table_record.relname as table_name,
       table_record.relrowsecurity as rls_enabled,
       table_record.relforcerowsecurity as rls_forced
from pg_class table_record
join pg_namespace namespace_record
  on namespace_record.oid = table_record.relnamespace
where namespace_record.nspname = 'public'
  and table_record.relkind = 'r'
order by table_record.relname;

-- Private application buckets.
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in (
  'request-media', 'verification-documents', 'message-attachments',
  'review-media', 'profile-images', 'report-exports'
)
order by id;

-- Durable application queues.
select queue_name, is_partitioned, is_unlogged
from pgmq.meta
where queue_name in (
  'booking_timeouts', 'no_match_notifications',
  'scheduled_notifications', 'provider_work'
)
order by queue_name;

-- Scheduled queue consumer. It safely does nothing until the required Vault
-- values are configured.
select jobid, jobname, schedule, command, active
from cron.job
where jobname = 'ayos-queue-consumer';

-- Authoritative geography columns and GiST indexes.
select table_name, column_name, udt_name
from information_schema.columns
where table_schema = 'public'
  and udt_name = 'geography'
order by table_name, column_name;

select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and indexdef ilike '%using gist%'
order by tablename, indexname;

-- Development seed confirmation. Replace the placeholder content before
-- production use.
select key, title, published_at
from public.content_pages
order by key;

select name, is_active
from public.service_categories
order by name;
