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
}) {
  return invokeCommand('create_service_request', {
    category_id: input.categoryId,
    address_id: input.addressId,
    description: input.description,
    scheduled_at: input.scheduledAt,
    budget: input.budget,
    ...(input.notes ? { notes: input.notes } : {}),
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
