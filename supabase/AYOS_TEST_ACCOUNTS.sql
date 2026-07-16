-- A-YOS TEST ACCOUNTS
-- DEVELOPMENT AND STAGING ONLY. NEVER RUN THIS SCRIPT IN PRODUCTION.
--
-- Prerequisite: run supabase/AYOS_CLOUD_INSTALL.sql first.
-- This script is transactional and repeatable. It provisions three confirmed,
-- fully approved test accounts for customer, worker, and administrator flows.
--
-- Shared password: A-YosDemo123!
--   customer.demo@ayos.test
--   worker.demo@ayos.test
--   admin.demo@ayos.test
--
-- Identity-document paths below are database-only test markers. They are not
-- real government documents and do not create files in Supabase Storage.

begin;

do $ayos_test_preflight$
begin
  if to_regclass('public.profiles') is null
     or to_regclass('public.identity_verifications') is null
     or to_regclass('public.worker_applications') is null
     or to_regclass('public.categories') is null then
    raise exception using
      errcode = 'P0001',
      message = 'A_YOS_BACKEND_REQUIRED',
      detail = 'Run AYOS_CLOUD_INSTALL.sql before provisioning test accounts.';
  end if;

  if (
    select count(*) from public.categories
    where id in (
      '40000000-0000-0000-0000-000000000001',
      '40000000-0000-0000-0000-000000000002'
    )
  ) <> 2 then
    raise exception using
      errcode = 'P0001',
      message = 'A_YOS_TEST_CATEGORIES_REQUIRED',
      detail = 'The Plumbing and Electrical categories are required for the demo worker.';
  end if;

  if exists (
    select 1
    from auth.users existing
    join (
      values
        ('10000000-0000-0000-0000-000000000001'::uuid, 'customer.demo@ayos.test'::text),
        ('20000000-0000-0000-0000-000000000001'::uuid, 'worker.demo@ayos.test'::text),
        ('30000000-0000-0000-0000-000000000001'::uuid, 'admin.demo@ayos.test'::text)
    ) expected(id,email) on lower(existing.email) = lower(expected.email)
    where existing.id <> expected.id
  ) then
    raise exception using
      errcode = 'P0001',
      message = 'A_YOS_TEST_EMAIL_CONFLICT',
      detail = 'A demo email is already assigned to an unexpected Auth user. No changes were committed.';
  end if;
end
$ayos_test_preflight$;

insert into auth.users(
  instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,
  raw_app_meta_data,raw_user_meta_data,created_at,updated_at,
  confirmation_token,recovery_token,email_change_token_new,email_change,
  is_sso_user,is_anonymous
) values
  (
    '00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001',
    'authenticated','authenticated','customer.demo@ayos.test',
    extensions.crypt('A-YosDemo123!',extensions.gen_salt('bf')),now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Customer","last_name":"Demo","initial_role":"customer"}'::jsonb,
    now(),now(),'','','','',false,false
  ),
  (
    '00000000-0000-0000-0000-000000000000','20000000-0000-0000-0000-000000000001',
    'authenticated','authenticated','worker.demo@ayos.test',
    extensions.crypt('A-YosDemo123!',extensions.gen_salt('bf')),now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Worker","last_name":"Demo","initial_role":"worker"}'::jsonb,
    now(),now(),'','','','',false,false
  ),
  (
    '00000000-0000-0000-0000-000000000000','30000000-0000-0000-0000-000000000001',
    'authenticated','authenticated','admin.demo@ayos.test',
    extensions.crypt('A-YosDemo123!',extensions.gen_salt('bf')),now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Admin","last_name":"Demo","initial_role":"admin"}'::jsonb,
    now(),now(),'','','','',false,false
  )
on conflict(id) do update set
  aud=excluded.aud,
  role=excluded.role,
  email=excluded.email,
  encrypted_password=excluded.encrypted_password,
  email_confirmed_at=excluded.email_confirmed_at,
  raw_app_meta_data=excluded.raw_app_meta_data,
  raw_user_meta_data=excluded.raw_user_meta_data,
  updated_at=now(),
  banned_until=null,
  deleted_at=null,
  is_sso_user=false,
  is_anonymous=false;

insert into auth.identities(id,user_id,identity_data,provider,provider_id,last_sign_in_at,created_at,updated_at) values
  (
    '10000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',
    '{"sub":"10000000-0000-0000-0000-000000000001","email":"customer.demo@ayos.test","email_verified":true}'::jsonb,
    'email','customer.demo@ayos.test',now(),now(),now()
  ),
  (
    '20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001',
    '{"sub":"20000000-0000-0000-0000-000000000001","email":"worker.demo@ayos.test","email_verified":true}'::jsonb,
    'email','worker.demo@ayos.test',now(),now(),now()
  ),
  (
    '30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',
    '{"sub":"30000000-0000-0000-0000-000000000001","email":"admin.demo@ayos.test","email_verified":true}'::jsonb,
    'email','admin.demo@ayos.test',now(),now(),now()
  )
on conflict(provider_id,provider) do update set
  user_id=excluded.user_id,
  identity_data=excluded.identity_data,
  last_sign_in_at=excluded.last_sign_in_at,
  updated_at=now();

insert into public.profiles(id,first_name,last_name,phone,account_status) values
  ('10000000-0000-0000-0000-000000000001','Customer','Demo','09170000001','active'),
  ('20000000-0000-0000-0000-000000000001','Worker','Demo','09170000002','active'),
  ('30000000-0000-0000-0000-000000000001','Admin','Demo','09170000003','active')
on conflict(id) do update set
  first_name=excluded.first_name,
  last_name=excluded.last_name,
  phone=excluded.phone,
  account_status='active',
  updated_at=now();

delete from public.user_roles
where user_id in (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001'
);

insert into public.user_roles(user_id,role) values
  ('10000000-0000-0000-0000-000000000001','customer'),
  ('20000000-0000-0000-0000-000000000001','customer'),
  ('20000000-0000-0000-0000-000000000001','worker'),
  ('30000000-0000-0000-0000-000000000001','admin');

update public.addresses set is_default=false
where user_id in (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001'
) and id not in (
  '50000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000003'
);

insert into public.addresses(
  id,user_id,label,street,city,region,postal_code,location,is_default
) values
  (
    '50000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',
    'Home','Ayala Avenue','Makati','Metro Manila','1226',
    extensions.st_setsrid(extensions.st_makepoint(121.0244,14.5547),4326)::extensions.geography,true
  ),
  (
    '50000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000001',
    'Service base','Kalayaan Avenue','Makati','Metro Manila','1210',
    extensions.st_setsrid(extensions.st_makepoint(121.0310,14.5590),4326)::extensions.geography,true
  )
on conflict(id) do update set
  user_id=excluded.user_id,
  label=excluded.label,
  street=excluded.street,
  city=excluded.city,
  region=excluded.region,
  postal_code=excluded.postal_code,
  location=excluded.location,
  is_default=true,
  updated_at=now();

delete from public.identity_verifications
where user_id in (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001'
) and id not in (
  '60000000-0000-0000-0000-000000000001',
  '60000000-0000-0000-0000-000000000003'
);

insert into public.identity_verifications(
  id,user_id,version,id_type,front_path,back_path,status,reviewed_at,reviewed_by
) values
  (
    '60000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',1,
    'test_document','10000000-0000-0000-0000-000000000001/demo-front.jpg',
    '10000000-0000-0000-0000-000000000001/demo-back.jpg','approved',now(),
    '30000000-0000-0000-0000-000000000001'
  ),
  (
    '60000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000001',1,
    'test_document','20000000-0000-0000-0000-000000000001/demo-front.jpg',
    '20000000-0000-0000-0000-000000000001/demo-back.jpg','approved',now(),
    '30000000-0000-0000-0000-000000000001'
  )
on conflict(id) do update set
  version=excluded.version,
  id_type=excluded.id_type,
  front_path=excluded.front_path,
  back_path=excluded.back_path,
  status='approved',
  rejection_reason=null,
  reviewed_at=now(),
  reviewed_by=excluded.reviewed_by;

delete from public.worker_applications
where user_id='20000000-0000-0000-0000-000000000001'
  and id<>'70000000-0000-0000-0000-000000000001';

insert into public.worker_applications(
  id,user_id,status,experience_years,experience_summary,rating,review_count,
  base_location,service_radius_meters,rejection_reason,reviewed_at,reviewed_by
) values (
  '70000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001',
  'approved',8,'Licensed test provider with plumbing and electrical experience.',4.9,12,
  extensions.st_setsrid(extensions.st_makepoint(121.0310,14.5590),4326)::extensions.geography,
  25000,null,now(),'30000000-0000-0000-0000-000000000001'
)
on conflict(id) do update set
  user_id=excluded.user_id,
  status='approved',
  experience_years=excluded.experience_years,
  experience_summary=excluded.experience_summary,
  rating=excluded.rating,
  review_count=excluded.review_count,
  base_location=excluded.base_location,
  service_radius_meters=excluded.service_radius_meters,
  rejection_reason=null,
  reviewed_at=now(),
  reviewed_by=excluded.reviewed_by,
  updated_at=now();

delete from public.worker_services
where worker_id='70000000-0000-0000-0000-000000000001'
  and id not in (
    '80000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000002'
  );

insert into public.worker_services(
  id,worker_id,category_id,title,description,price_centavos,is_active
) values
  (
    '80000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001','Plumbing Home Visit',
    'Inspection and standard plumbing repair',150000,true
  ),
  (
    '80000000-0000-0000-0000-000000000002','70000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000002','Electrical Home Visit',
    'Inspection and standard electrical repair',175000,true
  )
on conflict(id) do update set
  worker_id=excluded.worker_id,
  category_id=excluded.category_id,
  title=excluded.title,
  description=excluded.description,
  price_centavos=excluded.price_centavos,
  is_active=true,
  updated_at=now();

delete from public.worker_availability
where worker_id='70000000-0000-0000-0000-000000000001';

insert into public.worker_availability(worker_id,weekday,start_time,end_time,is_active)
select '70000000-0000-0000-0000-000000000001',day,'08:00','18:00',true
from generate_series(1,6) day;

commit;

-- Installation summary shown by the Supabase SQL Editor.
select
  auth_user.email,
  string_agg(role.role::text,', ' order by role.role::text) as roles,
  profile.account_status,
  verification.status as id_verification,
  worker.status as worker_application
from auth.users auth_user
join public.profiles profile on profile.id=auth_user.id
join public.user_roles role on role.user_id=auth_user.id
left join public.identity_verifications verification
  on verification.user_id=auth_user.id and verification.version=1
left join public.worker_applications worker on worker.user_id=auth_user.id
where auth_user.id in (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001'
)
group by auth_user.email,profile.account_status,verification.status,worker.status
order by auth_user.email;
