import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle2, ClipboardCheck, LogOut, RefreshCw, ShieldCheck, Users, Wrench } from 'lucide-react-native';
import { AppButton } from '@/components/AppButton';
import { AppText } from '@/components/AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/services/auth';

type Verification = { id: string; user_id: string; id_type: string; status: string; submitted_at: string; front_path:string;back_path:string; profiles: { first_name: string; last_name: string } };
type Worker = { id: string; user_id: string; status: string; experience_summary: string; profiles: { first_name: string; last_name: string } };
type Audit = { id: string; action: string; entity_type: string; reason: string; created_at: string };
type Account = { id:string;first_name:string;last_name:string;account_status:string };
type Category = { id:string;name:string;is_active:boolean };
type Booking = { id:string;status:string;price_centavos:number;cash_records:{id:string;status:string}|null };
type Review = { id:string;rating:number;comment:string|null;is_hidden:boolean };
type Service = { id:string;title:string;price_centavos:number };
const ask=(message:string,initial='')=>Platform.OS==='web'?globalThis.prompt(message,initial):initial;

export default function AdminDashboard() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [accounts,setAccounts]=useState<Account[]>([]); const [categories,setCategories]=useState<Category[]>([]);
  const [bookings,setBookings]=useState<Booking[]>([]); const [reviews,setReviews]=useState<Review[]>([]); const [services,setServices]=useState<Service[]>([]);
  const [busy, setBusy] = useState(false);
  const [idImages,setIdImages]=useState<Record<string,{front?:string;back?:string}>>({});
  const load = useCallback(async () => {
    setBusy(true);
    const [ids, applications, logs,accountRows,categoryRows,bookingRows,reviewRows,serviceRows] = await Promise.all([
      supabase.from('identity_verifications').select('id,user_id,id_type,status,submitted_at,front_path,back_path,profiles!identity_verifications_user_id_fkey(first_name,last_name)').order('submitted_at'),
      supabase.from('worker_applications').select('id,user_id,status,experience_summary,profiles!worker_applications_user_id_fkey(first_name,last_name)').order('created_at'),
      supabase.from('admin_audit_logs').select('id,action,entity_type,reason,created_at').order('created_at',{ascending:false}).limit(20),
      supabase.from('profiles').select('id,first_name,last_name,account_status').order('last_name'),
      supabase.from('categories').select('id,name,is_active').order('name'),
      supabase.from('bookings').select('id,status,price_centavos,cash_records(id,status)').order('created_at',{ascending:false}).limit(30),
      supabase.from('reviews').select('id,rating,comment,is_hidden').order('created_at',{ascending:false}).limit(30),
      supabase.from('worker_services').select('id,title,price_centavos').order('updated_at',{ascending:false}).limit(30),
    ]);
    setVerifications((ids.data || []) as unknown as Verification[]); setWorkers((applications.data || []) as unknown as Worker[]); setAudits((logs.data || []) as Audit[]); setBusy(false);
    setAccounts((accountRows.data||[]) as Account[]); setCategories((categoryRows.data||[]) as Category[]); setBookings((bookingRows.data||[]) as unknown as Booking[]);
    setReviews((reviewRows.data||[]) as Review[]); setServices((serviceRows.data||[]) as Service[]);
    const images:Record<string,{front?:string;back?:string}>={};
    await Promise.all(((ids.data||[]) as unknown as Verification[]).flatMap(item=>[
      supabase.storage.from('identity-documents').createSignedUrl(item.front_path,300).then(({data})=>{if(data)images[item.id]={...images[item.id],front:data.signedUrl};}),
      supabase.storage.from('identity-documents').createSignedUrl(item.back_path,300).then(({data})=>{if(data)images[item.id]={...images[item.id],back:data.signedUrl};}),
    ]));setIdImages(images);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const reviewId = async (id: string, decision: 'approved'|'rejected'|'resubmission_required') => {
    const reason = decision === 'approved' ? 'Documents manually reviewed and approved.' : decision === 'rejected' ? 'Documents did not pass manual review.' : 'Clear front and back images are required.';
    const { error } = await supabase.rpc('admin_review_identity',{verification_uuid:id,decision,reason});
    if (error) Alert.alert('Review failed',error.message); else void load();
  };
  const reviewWorker = async (id: string, decision: 'approved'|'rejected') => {
    const { error } = await supabase.rpc('admin_review_worker',{application_uuid:id,decision,reason:decision==='approved'?'Application and fixed-price service approved.':'Application requires correction.'});
    if (error) Alert.alert('Worker review failed',error.message); else void load();
  };
  const accountStatus=async(id:string,status:'active'|'suspended')=>{const reason=ask('Reason for this account change:','Manual administrative review.');if(!reason)return;const{error}=await supabase.rpc('admin_set_account_status',{user_uuid:id,next_status:status,reason});if(error)Alert.alert('Account update failed',error.message);else void load();};
  const toggleCategory=async(item:Category)=>{const reason=ask('Reason for category change:','Category availability updated by admin.');if(!reason)return;const{error}=await supabase.rpc('admin_set_category_active',{category_uuid:item.id,active:!item.is_active,reason});if(error)Alert.alert('Category update failed',error.message);else void load();};
  const overrideBooking=async(id:string,status:'completed'|'cancelled')=>{const reason=ask('Reason for booking override:');if(!reason)return;const{error}=await supabase.rpc('admin_override_booking',{booking_uuid:id,next_status:status,reason});if(error)Alert.alert('Booking override failed',error.message);else void load();};
  const setCash=async(id:string,status:'paid'|'disputed')=>{const reason=ask('Reason for cash status change:');if(!reason)return;const{error}=await supabase.rpc('admin_set_cash_status',{cash_uuid:id,next_status:status,reason});if(error)Alert.alert('Cash update failed',error.message);else void load();};
  const moderate=async(item:Review)=>{const reason=ask('Reason for review moderation:');if(!reason)return;const{error}=await supabase.rpc('admin_moderate_review',{review_uuid:item.id,hidden:!item.is_hidden,reason});if(error)Alert.alert('Review moderation failed',error.message);else void load();};
  const correctPrice=async(item:Service)=>{const pesos=ask('New fixed price in Philippine pesos:',String(item.price_centavos/100));const reason=ask('Reason for price correction:');if(!pesos||!reason)return;const centavos=Math.round(Number(pesos)*100);if(!Number.isFinite(centavos)||centavos<0){Alert.alert('Invalid price');return;}const{error}=await supabase.rpc('admin_correct_service_price',{service_uuid:item.id,next_price_centavos:centavos,reason});if(error)Alert.alert('Price correction failed',error.message);else void load();};
  return <View style={styles.page}>
    <View style={styles.sidebar}>
      <View style={styles.brand}><ShieldCheck color={Colors.white}/><AppText variant="h3" weight="bold" color={Colors.white}>A-yos Admin</AppText></View>
      <View style={styles.nav}><ClipboardCheck color={Colors.white}/><AppText variant="body" color={Colors.white}>Operations</AppText></View>
      <Pressable style={styles.logout} onPress={async()=>{await signOut();router.replace('/sign-in');}}><LogOut color={Colors.white}/><AppText variant="body" color={Colors.white}>Sign out</AppText></Pressable>
    </View>
    <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
      <View style={styles.heading}><View><AppText variant="h1" weight="bold">Operations Dashboard</AppText><AppText variant="body" color={Colors.textSecondary}>Manual verification, worker approval, and audited platform oversight</AppText></View><AppButton label="Refresh" size="sm" loading={busy} onPress={load} leftIcon={<RefreshCw size={16} color={Colors.white}/>} /></View>
      <View style={styles.metrics}><Metric icon={<Users color={Colors.primary}/>} label="ID reviews" value={String(verifications.filter(x=>x.status==='pending').length)}/><Metric icon={<Wrench color={Colors.warning}/>} label="Worker reviews" value={String(workers.filter(x=>x.status==='pending').length)}/><Metric icon={<CheckCircle2 color={Colors.success}/>} label="Audit events" value={String(audits.length)}/></View>
      <Section title="Identity verification">
        {verifications.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="bold">{item.profiles.first_name} {item.profiles.last_name}</AppText><AppText variant="caption" color={Colors.textSecondary}>{item.id_type} · {item.status}</AppText></View><View style={styles.idPreview}>{idImages[item.id]?.front&&<Image source={{uri:idImages[item.id].front}} style={styles.idImage}/>} {idImages[item.id]?.back&&<Image source={{uri:idImages[item.id].back}} style={styles.idImage}/>}</View>{item.status==='pending'&&<View style={styles.actions}><AppButton label="Approve" size="sm" onPress={()=>reviewId(item.id,'approved')}/><AppButton label="Resubmit" size="sm" variant="outline" onPress={()=>reviewId(item.id,'resubmission_required')}/><AppButton label="Reject" size="sm" variant="danger" onPress={()=>reviewId(item.id,'rejected')}/></View>}</View>)}
      </Section>
      <Section title="Worker applications">
        {workers.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="bold">{item.profiles.first_name} {item.profiles.last_name}</AppText><AppText variant="caption" color={Colors.textSecondary}>{item.experience_summary} · {item.status}</AppText></View>{item.status==='pending'&&<View style={styles.actions}><AppButton label="Approve" size="sm" onPress={()=>reviewWorker(item.id,'approved')}/><AppButton label="Reject" size="sm" variant="danger" onPress={()=>reviewWorker(item.id,'rejected')}/></View>}</View>)}
      </Section>
      <Section title="Accounts">{accounts.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="bold">{item.first_name} {item.last_name}</AppText><AppText variant="caption" color={Colors.textSecondary}>{item.account_status}</AppText></View><AppButton label={item.account_status==='suspended'?'Reactivate':'Suspend'} size="sm" variant={item.account_status==='suspended'?'outline':'danger'} onPress={()=>accountStatus(item.id,item.account_status==='suspended'?'active':'suspended')}/></View>)}</Section>
      <Section title="Categories">{categories.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="bold">{item.name}</AppText><AppText variant="caption" color={Colors.textSecondary}>{item.is_active?'Active':'Inactive'}</AppText></View><AppButton label={item.is_active?'Disable':'Enable'} size="sm" variant="outline" onPress={()=>toggleCategory(item)}/></View>)}</Section>
      <Section title="Worker services and fixed prices">{services.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="bold">{item.title}</AppText><AppText variant="caption" color={Colors.textSecondary}>₱{(item.price_centavos/100).toFixed(2)}</AppText></View><AppButton label="Correct price" size="sm" variant="outline" onPress={()=>correctPrice(item)}/></View>)}</Section>
      <Section title="Booking and cash oversight">{bookings.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="bold">Booking {item.id.slice(0,8)}</AppText><AppText variant="caption" color={Colors.textSecondary}>{item.status} · cash {item.cash_records?.status||'unavailable'} · ₱{(item.price_centavos/100).toFixed(2)}</AppText></View><View style={styles.actions}>{item.cash_records&&<><AppButton label="Cash paid" size="sm" onPress={()=>setCash(item.cash_records!.id,'paid')}/><AppButton label="Dispute" size="sm" variant="outline" onPress={()=>setCash(item.cash_records!.id,'disputed')}/></>}<AppButton label="Complete" size="sm" variant="outline" onPress={()=>overrideBooking(item.id,'completed')}/><AppButton label="Cancel" size="sm" variant="danger" onPress={()=>overrideBooking(item.id,'cancelled')}/></View></View>)}</Section>
      <Section title="Review moderation">{reviews.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="bold">{item.rating}/5 {item.is_hidden?'· Hidden':''}</AppText><AppText variant="caption" color={Colors.textSecondary}>{item.comment||'No written comment'}</AppText></View><AppButton label={item.is_hidden?'Restore':'Hide'} size="sm" variant="outline" onPress={()=>moderate(item)}/></View>)}</Section>
      <Section title="Recent audit log">{audits.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="semiBold">{item.action}</AppText><AppText variant="caption" color={Colors.textSecondary}>{item.entity_type} · {item.reason} · {new Date(item.created_at).toLocaleString()}</AppText></View></View>)}</Section>
    </ScrollView>
  </View>;
}
function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <View style={styles.metric}>{icon}<View><AppText variant="h2" weight="bold">{value}</AppText><AppText variant="caption" color={Colors.textSecondary}>{label}</AppText></View></View>}
function Section({title,children}:{title:string;children:React.ReactNode}){return <View style={styles.section}><AppText variant="h3" weight="bold">{title}</AppText><View style={styles.card}>{children}</View></View>}
const styles=StyleSheet.create({page:{flex:1,flexDirection:'row',backgroundColor:'#F3F5F7'},sidebar:{width:230,backgroundColor:'#12372A',padding:Spacing['5']},brand:{flexDirection:'row',gap:10,alignItems:'center',marginBottom:40},nav:{flexDirection:'row',gap:10,alignItems:'center',backgroundColor:'rgba(255,255,255,.12)',padding:14,borderRadius:Radius.lg},logout:{marginTop:'auto',flexDirection:'row',gap:10,alignItems:'center'},content:{flex:1},contentInner:{padding:32,maxWidth:1200,width:'100%',alignSelf:'center'},heading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},metrics:{flexDirection:'row',gap:16,marginTop:24},metric:{flex:1,flexDirection:'row',gap:16,alignItems:'center',backgroundColor:Colors.white,padding:20,borderRadius:Radius.xl},section:{marginTop:28,gap:12},card:{backgroundColor:Colors.white,borderRadius:Radius.xl,overflow:'hidden'},row:{padding:16,borderBottomWidth:1,borderBottomColor:Colors.borderLight,flexDirection:'row',alignItems:'center',gap:16},rowInfo:{flex:1},actions:{flexDirection:'row',gap:8},idPreview:{flexDirection:'row',gap:8},idImage:{width:88,height:56,borderRadius:Radius.sm,backgroundColor:Colors.borderLight}});
