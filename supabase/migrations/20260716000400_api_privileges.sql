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
