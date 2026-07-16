import type { ProviderData } from '@/components/ProviderCard';
import type { ReviewData, JobOpportunity, WorkerBooking } from '@/constants/workerMockData';
import type { WorkerProfile } from '@/constants/workerData';
import { requireSupabaseConfiguration, supabase } from '@/lib/supabase';
import { toServiceError, type BookingStatus, type ServiceError } from './contracts';

export interface ApiResponse<T> { data: T; error?: ServiceError }
const money = (centavos: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

async function run<T>(operation: () => Promise<T>, empty: T): Promise<ApiResponse<T>> {
  try { requireSupabaseConfiguration(); return { data: await operation() }; }
  catch (error) { return { data: empty, error: toServiceError(error) }; }
}

export function subscribeToBooking(bookingId: string, onChange: () => void) {
  return supabase.channel(`booking:${bookingId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `id=eq.${bookingId}` }, onChange)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'booking_status_events', filter: `booking_id=eq.${bookingId}` }, onChange)
    .subscribe();
}

export async function fetchProviders(): Promise<ApiResponse<ProviderData[]>> {
  return run(async () => {
    const { data, error } = await supabase.from('worker_services').select('id,title,price_centavos,worker_applications!inner(id,experience_years,rating,review_count,status,profiles!inner(first_name,last_name,avatar_path,account_status),categories!worker_services_category_id_fkey(name))').eq('is_active', true).eq('worker_applications.status', 'approved');
    if (error) throw error;
    return (data || []).map((row) => {
      const worker = row.worker_applications as unknown as { id: string; experience_years: number; rating: number; review_count: number; profiles: { first_name: string; last_name: string; avatar_path: string | null }; categories?: { name: string } };
      return { id: worker.id, name: `${worker.profiles.first_name} ${worker.profiles.last_name}`.trim(), category: `${row.title} · ${worker.experience_years} yrs exp`, avatarUri: worker.profiles.avatar_path || '', rating: Number(worker.rating), reviewCount: worker.review_count, distance: 'Distance calculated after location', eta: 'Route calculated at booking', verified: true, price: money(row.price_centavos) };
    });
  }, []);
}

export async function fetchProviderById(id: string): Promise<ApiResponse<ProviderData | undefined>> {
  const result = await fetchProviders();
  return { data: result.data.find((provider) => provider.id === id), error: result.error };
}

export async function fetchServiceCategories(): Promise<ApiResponse<Array<{ id: string; label: string; icon: string; color: string }>>> {
  return run(async () => { const { data, error } = await supabase.from('categories').select('id,name,icon').eq('is_active', true).order('name'); if (error) throw error; return (data || []).map((row) => ({ id: row.id, label: row.name, icon: row.icon || 'Grid2x2', color: '#1B5E20' })); }, []);
}

export async function fetchBookings(): Promise<ApiResponse<Array<{ id: string; providerId: string; providerName: string; category: string; avatarUri: string; date: string; time: string; status: 'upcoming' | 'completed' | 'cancelled'; address: string; price: string; rating: number; reviewed?: boolean }>>> {
  return run(async () => {
    const { data, error } = await supabase.from('bookings').select('id,worker_id,status,scheduled_at,price_centavos,worker_applications!inner(rating,profiles!inner(first_name,last_name,avatar_path)),worker_services!inner(title),reviews(id)').order('scheduled_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => { const worker = row.worker_applications as unknown as { rating: number; profiles: { first_name: string; last_name: string; avatar_path: string | null } }; const scheduled = new Date(row.scheduled_at); return { id: row.id, providerId: row.worker_id, providerName: `${worker.profiles.first_name} ${worker.profiles.last_name}`.trim(), category: (row.worker_services as unknown as { title: string }).title, avatarUri: worker.profiles.avatar_path || '', date: scheduled.toLocaleDateString(), time: scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: row.status === 'completed' ? 'completed' : row.status === 'cancelled' ? 'cancelled' : 'upcoming', address: 'Private service address', price: money(row.price_centavos), rating: Number(worker.rating), reviewed: Array.isArray(row.reviews) && row.reviews.length > 0 }; });
  }, []);
}

export async function fetchReviews(workerId?: string): Promise<ApiResponse<ReviewData[]>> {
  return run(async () => { let query = supabase.from('reviews').select('id,rating,comment,created_at,profiles!reviews_customer_id_fkey(first_name,last_name,avatar_path)').eq('is_hidden', false).order('created_at', { ascending: false }); if(workerId) query=query.eq('worker_id',workerId); const { data, error } = await query; if (error) throw error; return (data || []).map((row) => { const author = row.profiles as unknown as { first_name: string; last_name: string; avatar_path: string | null }; return { id: row.id, author: `${author.first_name} ${author.last_name}`.trim(), avatarUri: author.avatar_path || '', rating: row.rating, date: new Date(row.created_at).toLocaleDateString(), comment: row.comment || '', serviceType: 'Completed service' }; }); }, []);
}

export async function fetchWorkerProfile(): Promise<ApiResponse<WorkerProfile>> {
  const empty: WorkerProfile = { id: '', name: '', email: '', avatarUri: '', category: '', verificationStatus: 'pending', yearsExperience: 0, rating: 0, reviewCount: 0, completedJobs: 0, earnings: money(0), hourlyRate: money(0), skills: [], serviceAreas: [], portfolioImages: [], bio: '' };
  return run(async () => { const { data: user } = await supabase.auth.getUser(); if (!user.user) throw new Error('AUTHENTICATION_REQUIRED'); const { data, error } = await supabase.from('worker_applications').select('id,status,experience_years,experience_summary,rating,review_count,profiles!inner(first_name,last_name,avatar_path),worker_services(title,price_centavos)').eq('user_id', user.user.id).single(); if (error) throw error; const profile = data.profiles as unknown as { first_name: string; last_name: string; avatar_path: string | null }; const services = (data.worker_services || []) as Array<{ title: string; price_centavos: number }>; return { ...empty, id: data.id, name: `${profile.first_name} ${profile.last_name}`.trim(), email: user.user.email || '', avatarUri: profile.avatar_path || '', category: services[0]?.title || 'Service Provider', verificationStatus: data.status === 'approved' ? 'verified' : data.status === 'rejected' ? 'rejected' : 'pending', yearsExperience: Number(data.experience_years), rating: Number(data.rating), reviewCount: data.review_count, hourlyRate: money(services[0]?.price_centavos || 0), skills: services.map((item) => item.title), bio: data.experience_summary }; }, empty);
}

export async function fetchWorkerReviews() { return fetchReviews(); }
export async function fetchWorkerJobs(): Promise<ApiResponse<JobOpportunity[]>> { return { data: [], error: { code: 'FEATURE_LOCKED', message: 'The public bidding job board is not connected in the MVP.' } }; }
export async function fetchWorkerBookings(): Promise<ApiResponse<WorkerBooking[]>> { return run(async () => { const { data, error } = await supabase.from('bookings').select('id,status,scheduled_at,price_centavos,service_requests!inner(description_original),profiles!bookings_customer_id_fkey(first_name,last_name)').order('scheduled_at'); if (error) throw error; return (data || []).map((row) => { const displayStatus: WorkerBooking['status'] = row.status === 'completed' ? 'completed' : row.status === 'cancelled' ? 'cancelled' : ['in_progress','pending_confirmation'].includes(row.status) ? 'in_progress' : 'upcoming'; return ({ id: row.id, customerName: `${(row.profiles as unknown as { first_name: string }).first_name} ${(row.profiles as unknown as { last_name: string }).last_name}`, customerAvatar: '', service: 'Service Booking', category: 'Service', date: new Date(row.scheduled_at).toLocaleDateString(), time: new Date(row.scheduled_at).toLocaleTimeString(), status: displayStatus, location: 'Private service address', address: 'Private service address', price: money(row.price_centavos), description: (row.service_requests as unknown as { description_original: string }).description_original }); }); }, []); }

async function transition(id: string, next: BookingStatus) { return run(async () => { const { error } = await supabase.rpc('transition_booking', { booking_uuid: id, next_status: next, note: null, note_lang: null }); if (error) throw error; return { success: true }; }, { success: false }); }
export async function acceptJob(id: string) { return transition(id, 'accepted'); }
export async function startJob(id: string) {
  const { data } = await supabase.from('bookings').select('status').eq('id', id).single();
  const next: BookingStatus = data?.status === 'scheduled' ? 'accepted' : data?.status === 'accepted' ? 'en_route' : data?.status === 'en_route' ? 'arrived' : 'in_progress';
  return transition(id, next);
}
export async function completeJob(id: string) { return transition(id, 'pending_confirmation'); }
