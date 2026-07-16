import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle2, ClipboardCheck, LogOut, RefreshCw, ShieldCheck, Users, Wrench } from 'lucide-react-native';
import { AppButton } from '@/components/AppButton';
import { AppText } from '@/components/AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/services/auth';

type Verification = { id: string; user_id: string; id_type: string; status: string; submitted_at: string; profiles: { first_name: string; last_name: string } };
type Worker = { id: string; user_id: string; status: string; experience_summary: string; profiles: { first_name: string; last_name: string } };
type Audit = { id: string; action: string; entity_type: string; reason: string; created_at: string };

export default function AdminDashboard() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    setBusy(true);
    const [ids, applications, logs] = await Promise.all([
      supabase.from('identity_verifications').select('id,user_id,id_type,status,submitted_at,profiles!inner(first_name,last_name)').order('submitted_at'),
      supabase.from('worker_applications').select('id,user_id,status,experience_summary,profiles!inner(first_name,last_name)').order('created_at'),
      supabase.from('admin_audit_logs').select('id,action,entity_type,reason,created_at').order('created_at',{ascending:false}).limit(20),
    ]);
    setVerifications((ids.data || []) as unknown as Verification[]); setWorkers((applications.data || []) as unknown as Worker[]); setAudits((logs.data || []) as Audit[]); setBusy(false);
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
        {verifications.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="bold">{item.profiles.first_name} {item.profiles.last_name}</AppText><AppText variant="caption" color={Colors.textSecondary}>{item.id_type} · {item.status}</AppText></View>{item.status==='pending'&&<View style={styles.actions}><AppButton label="Approve" size="sm" onPress={()=>reviewId(item.id,'approved')}/><AppButton label="Resubmit" size="sm" variant="outline" onPress={()=>reviewId(item.id,'resubmission_required')}/><AppButton label="Reject" size="sm" variant="danger" onPress={()=>reviewId(item.id,'rejected')}/></View>}</View>)}
      </Section>
      <Section title="Worker applications">
        {workers.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="bold">{item.profiles.first_name} {item.profiles.last_name}</AppText><AppText variant="caption" color={Colors.textSecondary}>{item.experience_summary} · {item.status}</AppText></View>{item.status==='pending'&&<View style={styles.actions}><AppButton label="Approve" size="sm" onPress={()=>reviewWorker(item.id,'approved')}/><AppButton label="Reject" size="sm" variant="danger" onPress={()=>reviewWorker(item.id,'rejected')}/></View>}</View>)}
      </Section>
      <Section title="Recent audit log">{audits.map(item=><View key={item.id} style={styles.row}><View style={styles.rowInfo}><AppText variant="body" weight="semiBold">{item.action}</AppText><AppText variant="caption" color={Colors.textSecondary}>{item.entity_type} · {item.reason} · {new Date(item.created_at).toLocaleString()}</AppText></View></View>)}</Section>
    </ScrollView>
  </View>;
}
function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <View style={styles.metric}>{icon}<View><AppText variant="h2" weight="bold">{value}</AppText><AppText variant="caption" color={Colors.textSecondary}>{label}</AppText></View></View>}
function Section({title,children}:{title:string;children:React.ReactNode}){return <View style={styles.section}><AppText variant="h3" weight="bold">{title}</AppText><View style={styles.card}>{children}</View></View>}
const styles=StyleSheet.create({page:{flex:1,flexDirection:'row',backgroundColor:'#F3F5F7'},sidebar:{width:230,backgroundColor:'#12372A',padding:Spacing['5']},brand:{flexDirection:'row',gap:10,alignItems:'center',marginBottom:40},nav:{flexDirection:'row',gap:10,alignItems:'center',backgroundColor:'rgba(255,255,255,.12)',padding:14,borderRadius:Radius.lg},logout:{marginTop:'auto',flexDirection:'row',gap:10,alignItems:'center'},content:{flex:1},contentInner:{padding:32,maxWidth:1200,width:'100%',alignSelf:'center'},heading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},metrics:{flexDirection:'row',gap:16,marginTop:24},metric:{flex:1,flexDirection:'row',gap:16,alignItems:'center',backgroundColor:Colors.white,padding:20,borderRadius:Radius.xl},section:{marginTop:28,gap:12},card:{backgroundColor:Colors.white,borderRadius:Radius.xl,overflow:'hidden'},row:{padding:16,borderBottomWidth:1,borderBottomColor:Colors.borderLight,flexDirection:'row',alignItems:'center',gap:16},rowInfo:{flex:1},actions:{flexDirection:'row',gap:8}});

