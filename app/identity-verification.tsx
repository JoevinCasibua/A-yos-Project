import React,{useEffect,useState}from'react';
import{Alert,Pressable,ScrollView,StyleSheet,View}from'react-native';
import{Redirect,router}from'expo-router';
import{ChevronLeft,ShieldCheck}from'lucide-react-native';
import{AppButton}from'@/components/AppButton';
import{AppText}from'@/components/AppText';
import{ImageUploadCard}from'@/components/ImageUploadCard';
import{useAuth}from'@/context/AuthContext';
import{Colors,Layout,Radius,Spacing}from'@/constants/theme';
import{supabase}from'@/lib/supabase';
import{resubmitIdentityDocuments}from'@/services/auth';

export default function IdentityVerificationScreen(){
 const{user,verificationStatus,refreshProfile}=useAuth();const[reason,setReason]=useState<string|null>(null);const[front,setFront]=useState<string|null>(null);const[back,setBack]=useState<string|null>(null);const[busy,setBusy]=useState(false);
 useEffect(()=>{if(!user)return;void supabase.from('identity_verifications').select('rejection_reason').eq('user_id',user.id).order('version',{ascending:false}).limit(1).maybeSingle().then(({data})=>setReason(data?.rejection_reason||null));},[user]);
 if(!user)return <Redirect href="/sign-in"/>;
 const canResubmit=verificationStatus==='rejected'||verificationStatus==='resubmission_required';
 const submit=async()=>{if(!front||!back)return;setBusy(true);const result=await resubmitIdentityDocuments(front,back);setBusy(false);if(result.error){Alert.alert('Unable to resubmit',result.error.message);return;}await refreshProfile();Alert.alert('ID submitted','Your new documents are pending manual review.',[{text:'OK',onPress:()=>router.back()}]);};
 return <View style={styles.page}><View style={styles.header}><Pressable onPress={()=>router.back()} hitSlop={12}><ChevronLeft size={24} color={Colors.textPrimary}/></Pressable><AppText variant="h4" weight="bold">Identity Verification</AppText><View style={{width:24}}/></View><ScrollView contentContainerStyle={styles.content}><View style={styles.status}><ShieldCheck size={36} color={verificationStatus==='approved'?Colors.success:Colors.warning}/><AppText variant="h3" weight="bold">{verificationStatus==='approved'?'ID approved':verificationStatus==='pending'?'ID review pending':'ID resubmission required'}</AppText><AppText variant="body" color={Colors.textSecondary} align="center">{reason||'Your identity documents are reviewed manually and stored privately.'}</AppText></View>{canResubmit&&<View style={styles.card}><ImageUploadCard label="Front of valid ID" onImageSelected={setFront}/><ImageUploadCard label="Back of valid ID" onImageSelected={setBack}/><AppButton label="Submit New Documents" fullWidth loading={busy} disabled={!front||!back} onPress={submit}/></View>}</ScrollView></View>;
}
const styles=StyleSheet.create({page:{flex:1,backgroundColor:Colors.background},header:{paddingTop:60,paddingHorizontal:Layout.screenPadding,paddingBottom:Spacing['4'],flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:Colors.white},content:{padding:Layout.screenPadding,gap:Spacing['5']},status:{alignItems:'center',gap:Spacing['3'],padding:Spacing['5'],backgroundColor:Colors.white,borderRadius:Radius.xl},card:{gap:Spacing['4'],padding:Spacing['4'],backgroundColor:Colors.white,borderRadius:Radius.xl}});
