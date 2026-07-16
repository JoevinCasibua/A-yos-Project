-- Local development accounts. Never run this seed in production.
-- Password for every account: A-YosDemo123!
do $$
declare
  customer_id uuid := '10000000-0000-0000-0000-000000000001';
  pending_customer_id uuid := '10000000-0000-0000-0000-000000000002';
  worker_id uuid := '20000000-0000-0000-0000-000000000001';
  pending_worker_id uuid := '20000000-0000-0000-0000-000000000002';
  admin_id uuid := '30000000-0000-0000-0000-000000000001';
  uid uuid;
  email_address text;
  role_name text;
begin
  for uid, email_address, role_name in values
    (customer_id, 'customer.demo@ayos.test', 'customer'),
    (pending_customer_id, 'customer.pending@ayos.test', 'customer'),
    (worker_id, 'worker.demo@ayos.test', 'worker'),
    (pending_worker_id, 'worker.pending@ayos.test', 'worker'),
    (admin_id, 'admin.demo@ayos.test', 'admin')
  loop
    insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change_token_new,email_change)
    values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated',email_address,
      extensions.crypt('A-YosDemo123!', extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('first_name',initcap(split_part(email_address,'.',1)),'last_name','Demo','initial_role',role_name),now(),now(),'','','','')
    on conflict (id) do nothing;
    insert into auth.identities(id,user_id,identity_data,provider,provider_id,last_sign_in_at,created_at,updated_at)
    values(uid,uid,jsonb_build_object('sub',uid::text,'email',email_address),'email',email_address,now(),now(),now())
    on conflict (provider_id,provider) do nothing;
  end loop;
end $$;

insert into public.categories(id,slug,name,description,icon) values
('40000000-0000-0000-0000-000000000001','plumbing','Plumbing','Pipes, leaks, drains, and fixtures','wrench'),
('40000000-0000-0000-0000-000000000002','electrical','Electrical','Home electrical installation and repair','zap'),
('40000000-0000-0000-0000-000000000003','cleaning','Cleaning','Residential cleaning services','sparkles'),
('40000000-0000-0000-0000-000000000004','carpentry','Carpentry','Furniture and wood repair','hammer'),
('40000000-0000-0000-0000-000000000005','aircon','Air Conditioning','Aircon cleaning and repair','wind')
on conflict (id) do nothing;

insert into public.addresses(id,user_id,label,street,city,region,postal_code,location,is_default) values
('50000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Home','Ayala Avenue','Makati','Metro Manila','1226',extensions.st_setsrid(extensions.st_makepoint(121.0244,14.5547),4326)::extensions.geography,true),
('50000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','Home','Kalayaan Avenue','Makati','Metro Manila','1210',extensions.st_setsrid(extensions.st_makepoint(121.0350,14.5655),4326)::extensions.geography,true)
on conflict (id) do nothing;

insert into public.identity_verifications(id,user_id,id_type,front_path,back_path,status,reviewed_at,reviewed_by) values
('60000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','philsys','10000000-0000-0000-0000-000000000001/demo-front.jpg','10000000-0000-0000-0000-000000000001/demo-back.jpg','approved',now(),'30000000-0000-0000-0000-000000000001'),
('60000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','philsys','10000000-0000-0000-0000-000000000002/demo-front.jpg','10000000-0000-0000-0000-000000000002/demo-back.jpg','pending',null,null),
('60000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000001','drivers_license','20000000-0000-0000-0000-000000000001/demo-front.jpg','20000000-0000-0000-0000-000000000001/demo-back.jpg','approved',now(),'30000000-0000-0000-0000-000000000001'),
('60000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000002','drivers_license','20000000-0000-0000-0000-000000000002/demo-front.jpg','20000000-0000-0000-0000-000000000002/demo-back.jpg','pending',null,null)
on conflict (id) do nothing;

insert into public.worker_applications(id,user_id,status,experience_years,experience_summary,rating,review_count,base_location,service_radius_meters,reviewed_at,reviewed_by) values
('70000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','approved',8,'Licensed home-service professional with plumbing and electrical experience.',4.9,12,extensions.st_setsrid(extensions.st_makepoint(121.0310,14.5590),4326)::extensions.geography,25000,now(),'30000000-0000-0000-0000-000000000001'),
('70000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000002','pending',3,'Residential cleaning and maintenance experience.',0,0,extensions.st_setsrid(extensions.st_makepoint(121.0450,14.5700),4326)::extensions.geography,15000,null,null)
on conflict (id) do nothing;

insert into public.worker_services(id,worker_id,category_id,title,description,price_centavos) values
('80000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','Plumbing Home Visit','Inspection and standard plumbing repair',150000),
('80000000-0000-0000-0000-000000000002','70000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','Electrical Home Visit','Inspection and standard electrical repair',175000),
('80000000-0000-0000-0000-000000000003','70000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003','Home Cleaning','Standard home cleaning appointment',120000)
on conflict (id) do nothing;

insert into public.worker_availability(worker_id,weekday,start_time,end_time)
select '70000000-0000-0000-0000-000000000001', day, '08:00', '18:00' from generate_series(1,6) day
on conflict do nothing;

