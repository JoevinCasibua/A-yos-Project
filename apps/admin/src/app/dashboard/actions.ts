'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function required(form: FormData, name: string): string {
  const value = form.get(name);
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} is required.`);
  return value.trim();
}

function optional(form: FormData, name: string): string | undefined {
  const value = form.get(name);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

async function adminClient(requireAal2 = true) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: account } = await supabase
    .from('accounts')
    .select('role,status,mfa_enabled')
    .eq('id', user.id)
    .single();
  if (!account || account.role !== 'ADMIN' || account.status !== 'ACTIVE') redirect('/login');
  if (requireAal2 && account.mfa_enabled) {
    const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel !== 'aal2') redirect('/login?mfa=required');
  }
  return supabase;
}

async function invoke<Name extends string>(name: Name, args: Record<string, unknown>) {
  const supabase = await adminClient();
  const { error } = await supabase.rpc(name as never, args as never);
  if (error) throw new Error(error.message);
}

export async function setAccountStatus(form: FormData) {
  await invoke('set_account_status', {
    account_id: required(form, 'accountId'),
    next_status: required(form, 'nextStatus'),
  });
  revalidatePath('/dashboard/accounts');
}

export async function reviewWorker(form: FormData) {
  await invoke('review_worker_verification', {
    verification_id: required(form, 'verificationId'),
    decision: required(form, 'decision'),
    notes: optional(form, 'notes'),
  });
  revalidatePath('/dashboard/workers');
}

export async function setWorkerPriority(form: FormData) {
  await invoke('set_recommendation_priority', {
    worker_id: required(form, 'workerId'),
    enabled: form.get('enabled') === 'true',
  });
  revalidatePath('/dashboard/workers');
}

export async function transitionBooking(form: FormData) {
  await invoke('transition_booking', {
    p_booking_id: required(form, 'bookingId'),
    p_target_status: required(form, 'targetStatus'),
    p_expected_version: Number(required(form, 'version')),
    p_reason: optional(form, 'reason'),
  });
  revalidatePath('/dashboard/bookings');
}

export async function moderateReview(form: FormData) {
  await invoke('moderate_review', {
    review_id: required(form, 'reviewId'),
    decision: required(form, 'decision'),
  });
  revalidatePath('/dashboard/reviews');
}

export async function updateTicket(form: FormData) {
  await invoke('update_support_ticket', {
    p_ticket_id: required(form, 'ticketId'),
    p_next_status: required(form, 'nextStatus'),
    p_resolution: optional(form, 'resolution'),
  });
  revalidatePath('/dashboard/support');
}

export async function decideRefund(form: FormData) {
  await invoke('decide_refund', {
    p_refund_id: required(form, 'refundId'),
    p_decision: required(form, 'decision'),
    p_reason: required(form, 'reason'),
  });
  revalidatePath('/dashboard/finance');
}

export async function restoreTrash(form: FormData) {
  await invoke('restore_from_trash', { trash_id: required(form, 'trashId') });
  revalidatePath('/dashboard/trash');
}

export async function createNotification(form: FormData) {
  await invoke('admin_create_notification', {
    p_audience: required(form, 'audience'),
    p_title: required(form, 'title'),
    p_body: required(form, 'body'),
    p_category: required(form, 'category'),
    p_scheduled_at: optional(form, 'scheduledAt') ?? null,
  });
  revalidatePath('/dashboard/communication');
}

export async function upsertCategory(form: FormData) {
  await invoke('admin_upsert_service_category', {
    p_category_id: optional(form, 'categoryId') ?? null,
    p_name: required(form, 'name'),
    p_description: optional(form, 'description') ?? '',
    p_is_active: form.get('isActive') === 'on',
  });
  revalidatePath('/dashboard/services');
}

export async function upsertContent(form: FormData) {
  await invoke('admin_upsert_content', {
    content_key: required(form, 'contentKey'),
    title: required(form, 'title'),
    body: required(form, 'body'),
    version: required(form, 'version'),
    publish: form.get('publish') === 'on',
  });
  revalidatePath('/dashboard/settings');
}

export async function saveSetting(form: FormData) {
  const raw = required(form, 'value');
  let value: unknown;
  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    throw new Error('Setting value must be valid JSON.');
  }
  await invoke('admin_set_setting', {
    setting_key: required(form, 'key'),
    setting_value: value,
  });
  revalidatePath('/dashboard/settings');
}

export async function generateReport(form: FormData) {
  const supabase = await adminClient();
  const response = (await supabase.functions.invoke('report-export', {
    body: { reportType: required(form, 'reportType') },
  })) as { error: Error | null };
  if (response.error) throw response.error;
  revalidatePath('/dashboard/reports');
}

export async function updateAdminCredentials(form: FormData) {
  const supabase = await adminClient(false);
  const email = optional(form, 'email');
  const password = optional(form, 'password');
  if (!email && !password) throw new Error('Enter a new email or password.');
  if (password && password.length < 12)
    throw new Error('Password must contain at least 12 characters.');
  const { error } = await supabase.auth.updateUser({
    ...(email ? { email: email.toLowerCase() } : {}),
    ...(password ? { password } : {}),
  });
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/profile');
}
