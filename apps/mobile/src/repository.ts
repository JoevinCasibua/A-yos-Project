import type {
  AiAnalysisRequest,
  AiAnalysisResponse,
  BookingStatus,
  GeoCoordinate,
  RouteEstimate,
} from '@ayos/contracts';
import { ownedStoragePath, realtimeTopics, type Database } from '@ayos/supabase';
import { supabase } from './supabase';

type RpcName = keyof Database['public']['Functions'];
type Tables = Database['public']['Tables'];
export type Category = Tables['service_categories']['Row'];
export type WorkerProfile = Tables['worker_profiles']['Row'];
export type Booking = Tables['bookings']['Row'];
export type ServiceRequest = Tables['service_requests']['Row'];
export type Notification = Tables['notifications']['Row'];
export type Conversation = Tables['conversations']['Row'];
export type Message = Tables['messages']['Row'];
export type Review = Tables['reviews']['Row'];

export interface WorkerDirectoryItem extends WorkerProfile {
  categories: string[];
  years: number;
  rating: number;
  reviewCount: number;
}

export interface BookingItem extends Booking {
  request?: ServiceRequest;
}

export async function invokeCommand<Name extends RpcName>(
  name: Name,
  args: Database['public']['Functions'][Name]['Args'],
): Promise<Database['public']['Functions'][Name]['Returns']> {
  const { data, error } = await supabase.rpc(name, args);
  if (error) throw error;
  return data as unknown as Database['public']['Functions'][Name]['Returns'];
}

export function createServiceRequest(input: {
  categoryId: string;
  addressId: string;
  description: string;
  scheduledAt: string;
  budget: number;
  notes?: string;
  aiAnalysisId?: string;
  notifyOnMatch?: boolean;
}) {
  return invokeCommand('create_service_request', {
    category_id: input.categoryId,
    address_id: input.addressId,
    description: input.description,
    scheduled_at: input.scheduledAt,
    budget: input.budget,
    ...(input.notes ? { notes: input.notes } : {}),
    ...(input.aiAnalysisId ? { ai_analysis_id: input.aiAnalysisId } : {}),
    notify_on_match: input.notifyOnMatch ?? false,
  });
}
export function generateMatches(serviceRequestId: string) {
  return invokeCommand('generate_matches', { p_service_request_id: serviceRequestId });
}
export function startWorkerConversation(serviceRequestId: string, workerId: string) {
  return invokeCommand('start_worker_conversation', {
    p_service_request_id: serviceRequestId,
    p_worker_id: workerId,
  });
}
export function selectWorker(serviceRequestId: string, workerId: string) {
  return invokeCommand('select_worker', {
    p_service_request_id: serviceRequestId,
    p_worker_id: workerId,
  });
}
export function transitionBooking(
  bookingId: string,
  status: BookingStatus,
  version: number,
  reason?: string,
) {
  return invokeCommand('transition_booking', {
    p_booking_id: bookingId,
    p_target_status: status,
    p_expected_version: version,
    ...(reason ? { p_reason: reason } : {}),
  });
}
export function confirmCashPayment(bookingId: string, idempotencyKey: string) {
  return invokeCommand('confirm_cash_payment', {
    p_booking_id: bookingId,
    p_idempotency_key: idempotencyKey,
  });
}

export function createReview(
  bookingId: string,
  stars: number,
  body: string,
  recommendWorker: boolean,
) {
  return invokeCommand('create_review', {
    p_booking_id: bookingId,
    stars,
    body,
    recommend_worker: recommendWorker,
  });
}

export function attachRequestMedia(
  serviceRequestId: string,
  storagePath: string,
  contentType: string,
  byteSize: number,
) {
  return invokeCommand('attach_request_media', {
    p_service_request_id: serviceRequestId,
    p_storage_path: storagePath,
    p_content_type: contentType,
    p_byte_size: byteSize,
  });
}

export function attachReviewMedia(
  reviewId: string,
  storagePath: string,
  contentType: string,
  byteSize: number,
) {
  return invokeCommand('attach_review_media', {
    p_review_id: reviewId,
    p_storage_path: storagePath,
    p_content_type: contentType,
    p_byte_size: byteSize,
  });
}

export function saveAiAnalysis(analysisId: string) {
  return invokeCommand('save_ai_analysis', { p_analysis_id: analysisId });
}

function fail(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('name');
  fail(error);
  return data ?? [];
}

export async function listApprovedWorkers(): Promise<WorkerDirectoryItem[]> {
  const { data: profiles, error: profileError } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('approval_status', 'APPROVED')
    .eq('is_available', true)
    .order('recommendation_priority', { ascending: false });
  fail(profileError);
  const ids = (profiles ?? []).map((profile) => profile.account_id);
  if (!ids.length) return [];
  const [{ data: skills, error: skillsError }, { data: reviews, error: reviewsError }] =
    await Promise.all([
      supabase
        .from('worker_skills')
        .select('worker_id,years,service_categories(name)')
        .in('worker_id', ids),
      supabase
        .from('reviews')
        .select('worker_account_id,stars')
        .in('worker_account_id', ids)
        .eq('moderation_status', 'PUBLISHED'),
    ]);
  fail(skillsError);
  fail(reviewsError);
  return (profiles ?? []).map((profile) => {
    const workerSkills = (skills ?? []).filter((skill) => skill.worker_id === profile.account_id);
    const workerReviews = (reviews ?? []).filter(
      (review) => review.worker_account_id === profile.account_id,
    );
    return {
      ...profile,
      categories: workerSkills.flatMap((skill) => {
        const category = skill.service_categories as { name?: string } | null;
        return category?.name ? [category.name] : [];
      }),
      years: Math.max(0, ...workerSkills.map((skill) => skill.years)),
      rating: workerReviews.length
        ? workerReviews.reduce((sum, review) => sum + review.stars, 0) / workerReviews.length
        : 0,
      reviewCount: workerReviews.length,
    };
  });
}

export async function createAddress(input: Tables['addresses']['Insert']) {
  const { data, error } = await supabase.from('addresses').insert(input).select().single();
  fail(error);
  if (!data) throw new Error('The address could not be created.');
  return data;
}

export async function listAddresses(accountId: string) {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('account_id', accountId)
    .order('is_default', { ascending: false });
  fail(error);
  return data ?? [];
}

export async function listBookings(): Promise<BookingItem[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*,service_requests(*)')
    .order('created_at', { ascending: false });
  fail(error);
  return (data ?? []).map((row) => {
    const { service_requests: request, ...booking } = row;
    return { ...booking, request: request ?? undefined } as BookingItem;
  });
}

export async function listNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  fail(error);
  return data ?? [];
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId);
  fail(error);
}

export async function listConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .order('updated_at', { ascending: false });
  fail(error);
  return data ?? [];
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at');
  fail(error);
  return data ?? [];
}

export async function sendMessage(conversationId: string, senderId: string, body: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, body: body.trim() })
    .select()
    .single();
  fail(error);
  if (!data) throw new Error('The message could not be created.');
  return data;
}

export async function attachMessageMedia(input: Tables['message_attachments']['Insert']) {
  const { data, error } = await supabase
    .from('message_attachments')
    .insert(input)
    .select()
    .single();
  fail(error);
  if (!data) throw new Error('The attachment could not be created.');
  return data;
}

export async function listWorkerJobRequests(): Promise<ServiceRequest[]> {
  const { data: candidates, error: candidateError } = await supabase
    .from('match_candidates')
    .select('service_request_id')
    .eq('eligible', true);
  fail(candidateError);
  const ids = (candidates ?? []).map((candidate) => candidate.service_request_id);
  if (!ids.length) return [];
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .in('id', ids)
    .order('scheduled_at');
  fail(error);
  return data ?? [];
}

export async function listWorkerReviews(accountId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('worker_account_id', accountId)
    .eq('moderation_status', 'PUBLISHED')
    .order('created_at', { ascending: false });
  fail(error);
  return data ?? [];
}

export async function getWorkerOnboarding(accountId: string) {
  const [profile, verification, skills, availability, categories] = await Promise.all([
    supabase.from('worker_profiles').select('*').eq('account_id', accountId).single(),
    supabase.from('worker_verifications').select('*').eq('worker_id', accountId).maybeSingle(),
    supabase.from('worker_skills').select('*').eq('worker_id', accountId),
    supabase.from('worker_availability').select('*').eq('worker_id', accountId),
    listCategories(),
  ]);
  fail(profile.error);
  fail(verification.error);
  fail(skills.error);
  fail(availability.error);
  return {
    profile: profile.data,
    verification: verification.data,
    skills: skills.data ?? [],
    availability: availability.data ?? [],
    categories,
  };
}

export async function saveWorkerProfile(
  accountId: string,
  input: Pick<
    Tables['worker_profiles']['Update'],
    'bio' | 'experience' | 'service_area' | 'is_available'
  >,
) {
  const { error } = await supabase
    .from('worker_profiles')
    .update(input)
    .eq('account_id', accountId);
  fail(error);
}

export async function saveWorkerSkill(accountId: string, categoryId: string, years: number) {
  const { error } = await supabase
    .from('worker_skills')
    .upsert({ worker_id: accountId, category_id: categoryId, years });
  fail(error);
}

export async function saveWorkerAvailability(
  accountId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
) {
  const { error } = await supabase.from('worker_availability').upsert(
    {
      worker_id: accountId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
    },
    { onConflict: 'worker_id,day_of_week,start_time,end_time' },
  );
  fail(error);
}

export async function submitWorkerVerification(
  accountId: string,
  identityData: Database['public']['Tables']['worker_verifications']['Row']['identity_data'],
  documentPaths: string[],
) {
  const { data: existing, error: readError } = await supabase
    .from('worker_verifications')
    .select('id')
    .eq('worker_id', accountId)
    .maybeSingle();
  fail(readError);
  if (existing) {
    const { error } = await supabase
      .from('worker_verifications')
      .update({ identity_data: identityData, document_paths: documentPaths })
      .eq('id', existing.id);
    fail(error);
  } else {
    const { error } = await supabase.from('worker_verifications').insert({
      worker_id: accountId,
      identity_data: identityData,
      document_paths: documentPaths,
      status: 'PENDING',
    });
    fail(error);
  }
}

export function setAddressLocation(addressId: string, coordinate: GeoCoordinate) {
  return invokeCommand('set_address_location', {
    p_address_id: addressId,
    p_latitude: coordinate.latitude,
    p_longitude: coordinate.longitude,
  });
}

export function setWorkerServiceArea(coordinate: GeoCoordinate, radiusMeters: number) {
  return invokeCommand('set_worker_service_area', {
    p_latitude: coordinate.latitude,
    p_longitude: coordinate.longitude,
    p_radius_meters: radiusMeters,
  });
}

export function recordWorkerLocation(bookingId: string, coordinate: GeoCoordinate) {
  return invokeCommand('record_worker_location', {
    booking_id: bookingId,
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
  });
}

export function getBookingTracking(bookingId: string) {
  return invokeCommand('get_booking_tracking', { p_booking_id: bookingId, p_limit: 100 });
}

export async function analyzeIssue(input: AiAnalysisRequest): Promise<AiAnalysisResponse> {
  const response: { data: AiAnalysisResponse | null; error: unknown } =
    await supabase.functions.invoke<AiAnalysisResponse>('ai-analyze', {
      body: input,
    });
  if (response.error)
    throw response.error instanceof Error ? response.error : new Error('AI analysis failed.');
  if (!response.data) throw new Error('AI analysis returned no result.');
  return response.data;
}

export async function requestRoute(
  bookingId: string,
  origin: GeoCoordinate,
  destination: GeoCoordinate,
): Promise<RouteEstimate> {
  const response: { data: { data: RouteEstimate } | null; error: unknown } =
    await supabase.functions.invoke<{ data: RouteEstimate }>('maps', {
      body: { operation: 'ROUTE', bookingId, origin, destination },
    });
  if (response.error)
    throw response.error instanceof Error ? response.error : new Error('Route is unavailable.');
  if (!response.data) throw new Error('Route is unavailable.');
  return response.data.data;
}

export async function uploadPrivateObject(
  bucket:
    | 'request-media'
    | 'verification-documents'
    | 'message-attachments'
    | 'review-media'
    | 'profile-images',
  accountId: string,
  entityId: string,
  fileName: string,
  body: ArrayBuffer,
  contentType: string,
) {
  const path = ownedStoragePath(accountId, entityId, fileName);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, body, { contentType, upsert: false });
  if (error) throw error;
  return path;
}

export function subscribeToBooking(
  bookingId: string,
  onStatus: (payload: unknown) => void,
  onLocation: (payload: unknown) => void,
) {
  const topics = realtimeTopics(bookingId);
  const status = supabase
    .channel(topics.bookingStatus, { config: { private: true } })
    .on('broadcast', { event: '*' }, ({ payload }) => onStatus(payload))
    .subscribe();
  const location = supabase
    .channel(topics.bookingLocation, { config: { private: true } })
    .on('broadcast', { event: '*' }, ({ payload }) => onLocation(payload))
    .subscribe();
  return () => {
    void supabase.removeChannel(status);
    void supabase.removeChannel(location);
  };
}

export function subscribeToConversation(conversationId: string, onChange: () => void) {
  const channel = supabase
    .channel(`conversation:${conversationId}:messages`, { config: { private: true } })
    .on('broadcast', { event: '*' }, onChange)
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}

export function subscribeToNotifications(accountId: string, onChange: () => void) {
  const channel = supabase
    .channel(`user:${accountId}:notifications`, { config: { private: true } })
    .on('broadcast', { event: '*' }, onChange)
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
