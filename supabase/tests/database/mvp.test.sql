begin;
create extension if not exists pgtap with schema extensions;
select plan(20);

select extensions.has_table('public','profiles','profiles exists');
select extensions.has_table('public','identity_verifications','identity verification exists');
select extensions.has_table('public','worker_applications','worker applications exist');
select extensions.has_table('public','service_requests','service requests exist');
select extensions.has_table('public','recommendations','recommendations exist');
select extensions.has_table('public','bookings','bookings exist');
select extensions.has_table('public','cash_records','cash records exist');
select extensions.has_table('public','route_snapshots','route snapshots exist');
select extensions.has_table('public','workflow_translations','workflow translations exist');
select extensions.hasnt_table('public','bids','bids are excluded');
select extensions.hasnt_table('public','messages','messages are excluded');
select extensions.hasnt_table('public','conversations','conversations are excluded');
select extensions.has_function('public','publish_request',array['uuid'],'publish RPC exists');
select extensions.has_function('public','select_worker',array['uuid','uuid','text'],'atomic assignment RPC exists');
select extensions.has_function('public','confirm_cash',array['uuid','text'],'cash confirmation RPC exists');
select extensions.ok((select count(*)=2 from storage.buckets where id in('identity-documents','service-request-media') and not public),'storage buckets are private');
select extensions.ok((select status='approved' from public.identity_verifications where user_id='10000000-0000-0000-0000-000000000001' order by version desc limit 1),'demo customer is approved');
select extensions.ok((select status='pending' from public.identity_verifications where user_id='10000000-0000-0000-0000-000000000002' order by version desc limit 1),'pending customer remains pending');
select extensions.ok(has_column_privilege('authenticated','public.profiles','first_name','select'),'public worker name is selectable');
select extensions.ok(not has_column_privilege('authenticated','public.profiles','phone','select'),'worker phone is not publicly selectable');

select * from extensions.finish();
rollback;
