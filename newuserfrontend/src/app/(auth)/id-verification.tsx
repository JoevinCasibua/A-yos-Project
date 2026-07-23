import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/buttons/Button';
import { theme } from '../../theme';
import { ArrowLeft, UploadCloud, Camera, CheckCircle2 } from 'lucide-react-native';

export default function IDVerificationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);

  const handleSubmit = () => {
    if (!idUploaded || !selfieUploaded) {
      alert("Please complete both verification steps.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(auth)/admin-verification');
    }, 1000);
  };

  return (
    <Screen safeArea scrollable>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[theme.typography.h1, styles.title]}>Identity Verification</Text>
        <Text style={[theme.typography.body1, styles.subtitle]}>
          To keep our community safe, we need to verify your identity before you can hire professionals.
        </Text>

        {/* Government ID Upload */}
        <View style={styles.uploadSection}>
          <Text style={[theme.typography.h4, { marginBottom: theme.spacing.xs }]}>1. Government ID</Text>
          <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md }]}>Upload a clear photo of your valid Government ID.</Text>
          <TouchableOpacity 
            style={[styles.uploadBox, idUploaded && styles.uploadBoxSuccess]} 
            onPress={() => setIdUploaded(true)}
            activeOpacity={0.7}
          >
            {idUploaded ? (
              <>
                <CheckCircle2 color={theme.colors.success} size={32} style={{ marginBottom: 8 }} />
                <Text style={[theme.typography.body1, { color: theme.colors.success, fontWeight: 'bold', textAlign: 'center' }]}>ID Uploaded Successfully</Text>
              </>
            ) : (
              <>
                <UploadCloud color={theme.colors.textSecondary} size={32} style={{ marginBottom: 8 }} />
                <Text style={[theme.typography.body1, { color: theme.colors.textSecondary, textAlign: 'center', fontWeight: '500' }]}>Tap to Upload Government ID</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Selfie Upload */}
        <View style={styles.uploadSection}>
          <Text style={[theme.typography.h4, { marginBottom: theme.spacing.xs }]}>2. Selfie Verification</Text>
          <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md }]}>Take a clear selfie while holding the same Government ID next to your face.</Text>
          <TouchableOpacity 
            style={[styles.uploadBox, selfieUploaded && styles.uploadBoxSuccess]} 
            onPress={() => setSelfieUploaded(true)}
            activeOpacity={0.7}
          >
            {selfieUploaded ? (
              <>
                <CheckCircle2 color={theme.colors.success} size={32} style={{ marginBottom: 8 }} />
                <Text style={[theme.typography.body1, { color: theme.colors.success, fontWeight: 'bold', textAlign: 'center' }]}>Selfie Verified Successfully</Text>
              </>
            ) : (
              <>
                <Camera color={theme.colors.textSecondary} size={32} style={{ marginBottom: 8 }} />
                <Text style={[theme.typography.body1, { color: theme.colors.textSecondary, textAlign: 'center', fontWeight: '500' }]}>Tap to Take Selfie</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        <Button 
          title="Submit for Verification" 
          onPress={handleSubmit} 
          loading={loading}
          fullWidth 
          style={styles.submitBtn}
          disabled={!idUploaded || !selfieUploaded}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingBottom: theme.spacing.xxxl, paddingTop: theme.spacing.md },
  title: { color: theme.colors.textPrimary, marginBottom: theme.spacing.xs },
  subtitle: { color: theme.colors.textSecondary, marginBottom: theme.spacing.xl },
  
  uploadSection: { marginBottom: theme.spacing.xl },
  uploadBox: { borderWidth: 2, borderStyle: 'dashed', borderColor: theme.colors.border, borderRadius: theme.radius.lg, padding: theme.spacing.xl, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', minHeight: 160 },
  uploadBoxSuccess: { borderColor: theme.colors.success, backgroundColor: '#f0fdf4', borderStyle: 'solid' },
  
  submitBtn: { marginTop: theme.spacing.xl },
});
