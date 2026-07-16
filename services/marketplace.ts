import { requireSupabaseConfiguration, supabase } from '@/lib/supabase';
import type { RequestState } from '@/context/RequestContext';
import { type ServiceResult, toServiceError } from './contracts';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface AnalysisResult {
  summary: string; suggestedCategory: string; requiredSkills: string[]; visibleRisks: string[];
  confidence: number; provider: string; model: string | null; isFallback: boolean;
}
export interface RouteResult {
  origin: [number, number]; destination: [number, number]; distanceMeters: number; durationSeconds: number;
  geometry: { type: 'LineString'; coordinates: [number, number][] }; provider: string; status: 'complete' | 'estimated' | 'failed';
}
export interface WorkerRecommendation {
  id: string; name: string; category: string; avatarUri: string; rating: number; reviewCount: number;
  verified: true; estimatedPrice: string; eta: string; explanation: string;
}
async function sanitizeServicePhoto(uri:string){const result=await manipulateAsync(uri,[],{compress:.85,format:SaveFormat.JPEG});return result.uri;}
export interface PublishedRequestView{category:string;description:string;partsKnown:boolean|null;partsDescription:string|null;urgency:'ASAP'|'This Week';scheduledDate:Date|undefined;address:string;latitude:number;longitude:number;photos:string[];status:'Searching'|'Accepted'|'Cancelled';assignedWorkerId:string|null;}

async function invoke<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) throw error;
  if (data?.code) throw new Error(data.code);
  return data.data as T;
}

export async function analyzeRequest(description: string, photoUri?: string): Promise<ServiceResult<AnalysisResult>> {
  try {
    requireSupabaseConfiguration();
    let imageBase64: string | undefined;
    if (photoUri) {
      const sanitized=await sanitizeServicePhoto(photoUri);const response = await fetch(sanitized); const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte);
      imageBase64 = globalThis.btoa(binary);
    }
    return { data: await invoke<AnalysisResult>('analyze-service-request', { description, imageBase64, consent: Boolean(photoUri) }), error: null };
  } catch (error) { return { data: null, error: toServiceError(error) }; }
}

async function uploadRequestPhoto(userId: string, uri: string) {
  const sanitized=await sanitizeServicePhoto(uri);const response = await fetch(sanitized); if (!response.ok) throw new Error('VALIDATION_FAILED');
  const body = await response.arrayBuffer(); const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const { error } = await supabase.storage.from('service-request-media').upload(path, body, { contentType: response.headers.get('content-type') || 'image/jpeg' });
  if (error) throw error; return path;
}

export async function publishServiceRequest(draft: RequestState): Promise<ServiceResult<{ requestId: string }>> {
  try {
    requireSupabaseConfiguration();
    const { data: auth } = await supabase.auth.getUser(); if (!auth.user) throw new Error('AUTHENTICATION_REQUIRED');
    if (!draft.location) throw new Error('VALIDATION_FAILED');
    const { data: category, error: categoryError } = await supabase.from('categories').select('id').ilike('name', draft.category || draft.aiRecommendations[0] || 'Other').limit(1).maybeSingle();
    if (categoryError || !category) throw categoryError || new Error('VALIDATION_FAILED');
    const { data: address, error: addressError } = await supabase.from('addresses').select('id').eq('user_id', auth.user.id).eq('is_default', true).single();
    if (addressError) throw addressError;
    const point = `POINT(${draft.location.longitude} ${draft.location.latitude})`;
    const { error: locationError } = await supabase.from('addresses').update({ location: point }).eq('id', address.id); if (locationError) throw locationError;
    const urgency = draft.urgency === 'ASAP' ? 'asap' : 'scheduled';
    const { data: request, error } = await supabase.from('service_requests').insert({
      customer_id: auth.user.id, category_id: category.id, description_original: draft.description,
      description_language: 'en', parts_known: draft.hasParts, parts_description: draft.partsDescription || null,
      urgency, scheduled_at: urgency === 'scheduled' ? draft.scheduledDate?.toISOString() : null,
      address_id: address.id, location: point, status: 'draft',
    }).select('id').single();
    if (error) throw error;
    for (const uri of draft.photos) {
      const path = await uploadRequestPhoto(auth.user.id, uri);
      const { error: mediaError } = await supabase.from('service_request_media').insert({ request_id: request.id, owner_id: auth.user.id, object_path: path });
      if (mediaError) throw mediaError;
    }
    if (draft.aiSummary) {
      const { error: analysisError } = await supabase.from('ai_analyses').insert({ request_id: request.id, summary: draft.aiSummary, required_skills: draft.aiRecommendations, visible_risks: [], confidence: draft.confidenceScore / 100, provider: 'edge-function', model: null, is_fallback: draft.confidenceScore < 60 });
      if (analysisError) throw analysisError;
    }
    const { error: publishError } = await supabase.rpc('publish_request', { request_uuid: request.id }); if (publishError) throw publishError;
    const { error: recommendationsError } = await supabase.rpc('generate_recommendations', { request_uuid: request.id }); if (recommendationsError) throw recommendationsError;
    const translation = await translateWorkflowText(draft.description, 'en', 'fil');
    if (translation.data) {
      await supabase.rpc('save_workflow_translation', {
        entity_kind: 'service_request', entity_uuid: request.id, source_lang: 'en', target_lang: 'fil',
        original_value: draft.description, translated_value: translation.data.translatedText || '',
        translation_state: translation.data.status, provider_name: translation.data.provider, model_name: translation.data.model || undefined,
      });
    }
    return { data: { requestId: request.id }, error: null };
  } catch (error) { return { data: null, error: toServiceError(error) }; }
}

export async function selectRecommendedWorker(requestId: string, workerId: string): Promise<ServiceResult<{ bookingId: string }>> {
  try {
    const { data: request } = await supabase.from('service_requests').select('category_id').eq('id', requestId).single();
    if(!request?.category_id)throw new Error('VALIDATION_FAILED');
    const { data: service, error: serviceError } = await supabase.from('worker_services').select('id').eq('worker_id', workerId).eq('category_id', request.category_id).eq('is_active', true).limit(1).single();
    if (serviceError) throw serviceError;
    const key = `${requestId}:${workerId}`;
    const { data, error } = await supabase.rpc('select_worker', { request_uuid: requestId, worker_service_uuid: service.id, request_key: key });
    if (error) throw error;
    void createBookingRouteSnapshot(data.id);
    return { data: { bookingId: data.id }, error: null };
  } catch (error) { return { data: null, error: toServiceError(error) }; }
}

export async function fetchRecommendations(requestId: string): Promise<ServiceResult<WorkerRecommendation[]>> {
  try {
    const { data, error } = await supabase.from('recommendations').select('worker_id,rank,explanation,worker_applications!inner(rating,review_count,experience_years,profiles!worker_applications_user_id_fkey(first_name,last_name,avatar_path),worker_services!inner(title,price_centavos))').eq('request_id', requestId).order('rank');
    if (error) throw error;
    const values = (data || []).map((row) => {
      const worker = row.worker_applications as unknown as { rating: number; review_count: number; experience_years: number; profiles: { first_name: string; last_name: string; avatar_path: string | null }; worker_services: Array<{ title: string; price_centavos: number }> };
      const service = worker.worker_services[0];
      return { id: row.worker_id, name: `${worker.profiles.first_name} ${worker.profiles.last_name}`.trim(), category: `${service?.title || 'Service Provider'} · ${worker.experience_years} yrs exp`, avatarUri: worker.profiles.avatar_path || '', rating: Number(worker.rating), reviewCount: worker.review_count, verified: true as const, estimatedPrice: new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP'}).format((service?.price_centavos || 0)/100), eta: 'ETA calculated at booking', explanation: row.explanation };
    });
    return { data: values, error: null };
  } catch (error) { return { data: null, error: toServiceError(error) }; }
}

export async function fetchPublishedRequest(requestId:string):Promise<ServiceResult<PublishedRequestView>>{
  try{
    const[{data,error},{data:coordinates,error:coordinateError}]=await Promise.all([supabase.from('service_requests').select('description_original,parts_known,parts_description,urgency,scheduled_at,status,assigned_worker_id,categories!inner(name),addresses!inner(street_number,street,district,city,region),service_request_media(object_path)').eq('id',requestId).single(),supabase.rpc('get_request_coordinates',{request_uuid:requestId})]);if(error||coordinateError)throw error||coordinateError;
    const media=(data.service_request_media||[]) as {object_path:string}[];const signed=await Promise.all(media.map(item=>supabase.storage.from('service-request-media').createSignedUrl(item.object_path,300)));
    const category=data.categories as unknown as{name:string};const address=data.addresses as unknown as{street_number:string|null;street:string;district:string|null;city:string;region:string};
    const point=coordinates as unknown as{longitude:number;latitude:number};
    return{data:{category:category.name,description:data.description_original,partsKnown:data.parts_known,partsDescription:data.parts_description,urgency:data.urgency==='scheduled'?'This Week':'ASAP',scheduledDate:data.scheduled_at?new Date(data.scheduled_at):undefined,address:[address.street_number,address.street,address.district,address.city,address.region].filter(Boolean).join(', '),longitude:point.longitude,latitude:point.latitude,photos:signed.flatMap(item=>item.data?[item.data.signedUrl]:[]),status:data.status==='assigned'?'Accepted':data.status==='cancelled'?'Cancelled':'Searching',assignedWorkerId:data.assigned_worker_id},error:null};
  }catch(error){return{data:null,error:toServiceError(error)};}
}

export async function computeRoute(origin: [number,number], destination: [number,number]): Promise<ServiceResult<RouteResult>> {
  try { return { data: await invoke<RouteResult>('compute-route', { origin, destination }), error: null }; }
  catch (error) { return { data: null, error: toServiceError(error) }; }
}

async function routeContext(bookingId: string): Promise<{ origin: [number,number]; destination: [number,number] }> {
  const { data, error } = await supabase.rpc('get_booking_route_context', { booking_uuid: bookingId });
  if (error) throw error;
  return data as { origin: [number,number]; destination: [number,number] };
}

async function persistRoute(bookingId: string, route: RouteResult, workerSnapshot: boolean) {
  const { error } = await supabase.rpc('save_route_snapshot', {
    booking_uuid: bookingId,
    origin_lon: route.origin[0], origin_lat: route.origin[1],
    destination_lon: route.destination[0], destination_lat: route.destination[1],
    distance_value: route.distanceMeters, duration_value: route.durationSeconds,
    route_geometry: route.geometry, provider_name: route.provider,
    route_state: route.status, is_worker_snapshot: workerSnapshot,
  });
  if (error) throw error;
}

export async function createBookingRouteSnapshot(bookingId: string): Promise<ServiceResult<true>> {
  try {
    const context = await routeContext(bookingId);
    const route = await computeRoute(context.origin, context.destination);
    if (!route.data) throw route.error || new Error('ROUTE_UNAVAILABLE');
    await persistRoute(bookingId, route.data, false);
    return { data: true, error: null };
  } catch (error) { return { data: null, error: toServiceError(error) }; }
}

export async function saveEnRouteLocation(bookingId: string, workerLocation: [number,number]): Promise<ServiceResult<true>> {
  try {
    const context = await routeContext(bookingId);
    const route = await computeRoute(workerLocation, context.destination);
    if (!route.data) throw route.error || new Error('ROUTE_UNAVAILABLE');
    await persistRoute(bookingId, route.data, true);
    return { data: true, error: null };
  } catch (error) { return { data: null, error: toServiceError(error) }; }
}

export async function translateWorkflowText(text: string, sourceLanguage: 'en'|'fil', targetLanguage: 'en'|'fil') {
  try { return { data: await invoke<{ translatedText: string | null; status: 'complete'|'partial'|'failed'; provider: string; model: string | null }>('translate-workflow-text', { text, sourceLanguage, targetLanguage }), error: null }; }
  catch (error) { return { data: null, error: toServiceError(error) }; }
}

export async function submitBookingReview(bookingId:string,rating:number,comment:string):Promise<ServiceResult<{id:string}>>{
  try{const {data,error}=await supabase.rpc('submit_review',{booking_uuid:bookingId,stars:rating,review_comment:comment.trim()||undefined});if(error)throw error;return{data:{id:data.id},error:null};}
  catch(error){return{data:null,error:toServiceError(error)};}
}

export async function confirmBookingComplete(bookingId:string):Promise<ServiceResult<true>>{
  try{const note='Customer confirmed service completion.';const {error}=await supabase.rpc('transition_booking',{booking_uuid:bookingId,next_status:'completed',note,note_lang:'en'});if(error)throw error;void persistLatestBookingNoteTranslation(bookingId,note);return{data:true,error:null};}
  catch(error){return{data:null,error:toServiceError(error)};}
}

async function persistLatestBookingNoteTranslation(bookingId:string,original:string){
  const{data:event}=await supabase.from('booking_status_events').select('id').eq('booking_id',bookingId).not('note_original','is',null).order('created_at',{ascending:false}).limit(1).maybeSingle();if(!event)return;
  const translation=await translateWorkflowText(original,'en','fil');if(!translation.data)return;
  await supabase.rpc('save_workflow_translation',{entity_kind:'booking_status_event',entity_uuid:event.id,source_lang:'en',target_lang:'fil',original_value:original,translated_value:translation.data.translatedText||'',translation_state:translation.data.status,provider_name:translation.data.provider,model_name:translation.data.model||undefined});
}

export async function fetchBookingTracking(bookingId:string):Promise<ServiceResult<{status:string;workerId:string;route:RouteResult|null}>>{
  try{const [{data:booking,error},{data:routes}]=await Promise.all([supabase.from('bookings').select('status,worker_id').eq('id',bookingId).single(),supabase.from('route_snapshots').select('distance_meters,duration_seconds,geometry,provider,status').eq('booking_id',bookingId).order('calculated_at',{ascending:false}).limit(1)]);if(error)throw error;const item=routes?.[0];const geometry=item?.geometry as RouteResult['geometry']|null;return{data:{status:booking.status,workerId:booking.worker_id,route:item&&geometry?{origin:geometry.coordinates[0],destination:geometry.coordinates[geometry.coordinates.length-1],distanceMeters:item.distance_meters,durationSeconds:item.duration_seconds,geometry,provider:item.provider,status:item.status}:null},error:null};}
  catch(error){return{data:null,error:toServiceError(error)};}
}
