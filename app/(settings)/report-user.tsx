import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/buttons/Button';
import { theme } from '@/constants/theme';
import { ArrowLeft, UploadCloud, AlertTriangle, CheckCircle2, ShieldOff, Image as ImageIcon } from 'lucide-react-native';

export default function ReportUserScreen() {
  const router = useRouter();
  
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [blockUser, setBlockUser] = useState(false);
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!userName.trim() || !description.trim()) {
      alert("Please provide the user's name and describe the incident.");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 1500);
  };

  const handleFinish = () => {
    setShowSuccess(false);
    router.back();
  };

  return (
    <Screen safeArea scrollable>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Report & Block</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View style={styles.warningBox}>
          <AlertTriangle color={theme.colors.warning} size={24} style={{ marginRight: 12 }} />
          <Text style={[theme.typography.body2, { flex: 1, color: theme.colors.textSecondary }]}>
            We take reports seriously. Misuse of this feature may result in account penalties.
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>User to Report</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter the worker or customer's name"
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Describe the Incident</Text>
          <TextInput 
            style={[styles.input, styles.textArea]}
            placeholder="Please provide details about what happened..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload Evidence (Optional)</Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, marginBottom: 8 }]}>Screenshots or photos related to the incident</Text>
          
          <TouchableOpacity 
            style={[styles.uploadBox, evidenceUploaded && styles.uploadBoxSuccess]} 
            onPress={() => setEvidenceUploaded(true)}
            activeOpacity={0.7}
          >
            {evidenceUploaded ? (
              <>
                <CheckCircle2 color={theme.colors.success} size={28} style={{ marginBottom: 8 }} />
                <Text style={[theme.typography.body2, { color: theme.colors.success, fontWeight: 'bold' }]}>Evidence Attached</Text>
              </>
            ) : (
              <>
                <UploadCloud color={theme.colors.textSecondary} size={28} style={{ marginBottom: 8 }} />
                <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>Tap to attach photos</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.blockSection}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <ShieldOff color={theme.colors.error} size={20} style={{ marginRight: 12 }} />
            <View>
              <Text style={[theme.typography.body1, { fontWeight: '600' }]}>Block this user</Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>They won't be able to contact you.</Text>
            </View>
          </View>
          <Switch 
            value={blockUser} 
            onValueChange={setBlockUser}
            trackColor={{ false: theme.colors.border, true: theme.colors.error }}
            thumbColor={'#fff'}
          />
        </View>

        <Button 
          title="Submit Report" 
          onPress={handleSubmit} 
          loading={loading}
          style={styles.submitBtn}
        />
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CheckCircle2 color={theme.colors.success} size={64} style={{ marginBottom: 16 }} />
            <Text style={[theme.typography.h3, { marginBottom: 8, textAlign: 'center' }]}>Report Submitted</Text>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 24 }]}>
              Thank you for keeping the A-yos community safe. Our support team will review this incident shortly.
            </Text>
            <Button title="Done" onPress={handleFinish} fullWidth />
          </View>
        </View>
      </Modal>

    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding },
  
  warningBox: { flexDirection: 'row', backgroundColor: '#fffbeb', padding: 16, borderRadius: theme.radius.md, borderWidth: 1, borderColor: '#fde68a', marginBottom: 24, alignItems: 'center' },
  
  formGroup: { marginBottom: 20 },
  label: { ...theme.typography.label, marginBottom: 8 },
  input: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 16, ...theme.typography.body1 },
  textArea: { height: 120 },
  
  uploadBox: { borderWidth: 2, borderStyle: 'dashed', borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 24, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  uploadBoxSuccess: { borderColor: theme.colors.success, backgroundColor: '#f0fdf4', borderStyle: 'solid' },

  blockSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', padding: 16, borderRadius: theme.radius.md, borderWidth: 1, borderColor: '#fecaca', marginBottom: 32 },

  submitBtn: { backgroundColor: theme.colors.error },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: theme.layout.screenPadding },
  modalContent: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, padding: 32, alignItems: 'center', width: '100%' },
});
