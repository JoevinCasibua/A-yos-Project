import { supabase, requireSupabaseConfiguration } from '@/lib/supabase';
import { ServiceResult, toServiceError } from './contracts';

export interface CustomerRegistration {
  email: string; password: string; firstName: string; middleName?: string; lastName: string;
  phone: string; birthday: string; gender?: string; idType: string;
  frontIdUri: string; backIdUri: string; selfieUri?: string | null;
  address: { streetNumber?: string; street: string; district?: string; city: string; region: string; postalCode?: string };
}

export async function uploadPrivateImage(bucket: string, userId: string, kind: string, uri: string) {
  const response = await fetch(uri);
  if (!response.ok) throw new Error('VALIDATION_FAILED');
  const body = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `${userId}/${uploadId}-${kind}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, body, { contentType, upsert: false });
  if (error) throw error;
  return path;
}

export interface WorkerRegistration {
  email:string;password:string;firstName:string;middleName?:string;lastName:string;phone:string;birthday:string;gender?:string;
  industry:string;skills:string[];employmentType:string;streetNumber?:string;street:string;district?:string;city:string;region:string;postalCode?:string;
  idType:string;frontIdUri:string;backIdUri:string;experienceYears:number;experienceSummary:string;fixedPriceCentavos:number;serviceRadiusMeters:number;baseLocation:{latitude:number;longitude:number};
}
export async function registerWorker(input: WorkerRegistration): Promise<ServiceResult<{userId:string;applicationStatus:'pending'}>> {
  try {
    requireSupabaseConfiguration();
    const {data,error}=await supabase.auth.signUp({email:input.email.trim().toLowerCase(),password:input.password,options:{data:{first_name:input.firstName.trim(),middle_name:input.middleName?.trim(),last_name:input.lastName.trim(),phone:input.phone.trim(),initial_role:'worker'}}});
    if(error||!data.user) throw error||new Error('AUTHENTICATION_REQUIRED'); const userId=data.user.id;
    const [frontPath,backPath]=await Promise.all([uploadPrivateImage('identity-documents',userId,'front',input.frontIdUri),uploadPrivateImage('identity-documents',userId,'back',input.backIdUri)]);
    const {error:verificationError}=await supabase.from('identity_verifications').insert({user_id:userId,id_type:input.idType,front_path:frontPath,back_path:backPath,status:'pending'}); if(verificationError) throw verificationError;
    const {error:addressError}=await supabase.from('addresses').insert({user_id:userId,label:'Service base',street_number:input.streetNumber||null,street:input.street,district:input.district||null,city:input.city,region:input.region,postal_code:input.postalCode||null,is_default:true}); if(addressError) throw addressError;
    const {data:application,error:applicationError}=await supabase.from('worker_applications').insert({user_id:userId,status:'pending',experience_years:input.experienceYears,experience_summary:input.experienceSummary.trim(),base_location:`POINT(${input.baseLocation.longitude} ${input.baseLocation.latitude})`,service_radius_meters:input.serviceRadiusMeters}).select('id').single(); if(applicationError) throw applicationError;
    const {data:category,error:categoryError}=await supabase.from('categories').select('id').ilike('name',`%${input.industry}%`).limit(1).maybeSingle(); if(categoryError||!category) throw categoryError||new Error('VALIDATION_FAILED');
    const {error:serviceError}=await supabase.from('worker_services').insert({worker_id:application.id,category_id:category.id,title:input.skills[0]||input.industry,description:input.skills.join(', '),price_centavos:input.fixedPriceCentavos,is_active:true}); if(serviceError) throw serviceError;
    const availability=Array.from({length:6},(_,index)=>({worker_id:application.id,weekday:index+1,start_time:'08:00',end_time:'18:00',is_active:true}));
    const {error:availabilityError}=await supabase.from('worker_availability').insert(availability);if(availabilityError)throw availabilityError;
    return {data:{userId,applicationStatus:'pending'},error:null};
  } catch(error){return {data:null,error:toServiceError(error)};}
}

export async function signIn(email: string, password: string): Promise<ServiceResult<{ role: 'customer' | 'worker' | 'admin' }>> {
  try {
    requireSupabaseConfiguration();
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) throw error;
    const { data: roles, error: roleError } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id);
    if (roleError) throw roleError;
    const values = (roles || []).map((item) => item.role as 'customer' | 'worker' | 'admin');
    const role = values.includes('admin') ? 'admin' : values.includes('worker') ? 'worker' : 'customer';
    return { data: { role }, error: null };
  } catch (error) { return { data: null, error: toServiceError(error) }; }
}

export async function registerCustomer(input: CustomerRegistration): Promise<ServiceResult<{ userId: string; verificationStatus: 'pending' }>> {
  try {
    requireSupabaseConfiguration();
    const [month, day, year] = input.birthday.split('/');
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(), password: input.password,
      options: { data: { first_name: input.firstName.trim(), middle_name: input.middleName?.trim(), last_name: input.lastName.trim(), phone: input.phone.trim(), initial_role: 'customer' } },
    });
    if (error || !data.user) throw error || new Error('AUTHENTICATION_REQUIRED');
    const userId = data.user.id;
    const [frontPath, backPath, selfiePath] = await Promise.all([
      uploadPrivateImage('identity-documents', userId, 'front', input.frontIdUri),
      uploadPrivateImage('identity-documents', userId, 'back', input.backIdUri),
      input.selfieUri ? uploadPrivateImage('identity-documents', userId, 'selfie', input.selfieUri) : Promise.resolve(null),
    ]);
    const { error: profileError } = await supabase.from('profiles').update({ birthday: year && month && day ? `${year}-${month}-${day}` : null, gender: input.gender || null }).eq('id', userId);
    if (profileError) throw profileError;
    const { error: addressError } = await supabase.from('addresses').insert({ user_id: userId, label: 'Home', street_number: input.address.streetNumber || null, street: input.address.street, district: input.address.district || null, city: input.address.city, region: input.address.region, postal_code: input.address.postalCode || null, is_default: true });
    if (addressError) throw addressError;
    const { error: verificationError } = await supabase.from('identity_verifications').insert({ user_id: userId, id_type: input.idType, front_path: frontPath, back_path: backPath, selfie_path: selfiePath, status: 'pending' });
    if (verificationError) throw verificationError;
    return { data: { userId, verificationStatus: 'pending' }, error: null };
  } catch (error) { return { data: null, error: toServiceError(error) }; }
}

export async function signOut() { await supabase.auth.signOut(); }
export async function requestPasswordReset(email: string): Promise<ServiceResult<true>> {
  try { requireSupabaseConfiguration(); const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: 'ayos://sign-in' }); if (error) throw error; return { data: true, error: null }; }
  catch (error) { return { data: null, error: toServiceError(error) }; }
}

export async function resubmitIdentityDocuments(frontIdUri:string,backIdUri:string):Promise<ServiceResult<{status:'pending'}>>{
  try{
    requireSupabaseConfiguration();const{data:auth}=await supabase.auth.getUser();if(!auth.user)throw new Error('AUTHENTICATION_REQUIRED');
    const{data:latest,error:latestError}=await supabase.from('identity_verifications').select('version,id_type,status').eq('user_id',auth.user.id).order('version',{ascending:false}).limit(1).single();
    if(latestError)throw latestError;if(!['rejected','resubmission_required'].includes(latest.status))throw new Error('INVALID_TRANSITION');
    const[frontPath,backPath]=await Promise.all([uploadPrivateImage('identity-documents',auth.user.id,'front',frontIdUri),uploadPrivateImage('identity-documents',auth.user.id,'back',backIdUri)]);
    const{error}=await supabase.from('identity_verifications').insert({user_id:auth.user.id,version:latest.version+1,id_type:latest.id_type,front_path:frontPath,back_path:backPath,status:'pending'});if(error)throw error;
    return{data:{status:'pending'},error:null};
  }catch(error){return{data:null,error:toServiceError(error)};}
}
