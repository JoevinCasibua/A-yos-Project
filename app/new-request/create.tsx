import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/buttons/Button';
import { TextInput } from '@/components/inputs/TextInput';
import { theme } from '@/constants/theme';
import { ArrowLeft, X, Wrench, Droplets, Zap, Paintbrush, MapPin, Navigation, Camera, Mic, Settings, Info } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

const CATEGORIES = [
  { id: '1', name: 'Plumbing', icon: Droplets },
  { id: '2', name: 'Electrical', icon: Zap },
  { id: '3', name: 'Carpentry', icon: Wrench },
  { id: '4', name: 'Painting', icon: Paintbrush },
];

export default function CreateRequestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [address, setAddress] = useState('123 Main St, Makati City');
  const [description, setDescription] = useState('');
  
  const [cameraPhoto, setCameraPhoto] = useState<string | null>(null);
  const [voiceRecord, setVoiceRecord] = useState<string | null>(null);

  const handleNext = () => {
    if (!selectedCategory || !description || !address) {
      alert('Please select a service, specify a location, and describe the issue.');
      return;
    }
    // In a real app, we would pass state via a store or params
    router.push('/new-request/issue-summary');
  };

  const handleCameraClick = () => {
    setCameraPhoto('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop'); // Mock broken pipe photo
  };

  const handleVoiceClick = () => {
    setVoiceRecord('https://images.unsplash.com/photo-1614227361719-75a8de789243?q=80&w=400&auto=format&fit=crop'); // Audio waveform mock
  };

  return (
    <Screen safeArea scrollable>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>A-yos AI</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={[theme.typography.h2, styles.title]}>What do you need help with?</Text>
        
        {/* Categories */}
        <Text style={[theme.typography.label, styles.sectionTitle]}>Select Service</Text>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.categoryItemRow, isSelected && styles.categoryItemSelected]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Icon color={isSelected ? theme.colors.primary : theme.colors.textSecondary} size={24} />
                <Text style={[theme.typography.caption, { color: isSelected ? theme.colors.primary : theme.colors.textSecondary, marginTop: theme.spacing.xs, fontSize: 10, textAlign: 'center' }]} numberOfLines={1}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Camera */}
        <Text style={[theme.typography.label, styles.sectionTitle]}>Camera</Text>
        {cameraPhoto ? (
          <View style={styles.mediaPreview}>
            <Image source={cameraPhoto} style={styles.mediaImg} contentFit="cover" />
            <TouchableOpacity style={styles.removeMediaBtn} onPress={() => setCameraPhoto(null)}>
              <X color={theme.colors.surface} size={16} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.mediaUploadBtn} onPress={handleCameraClick}>
            <Camera color={theme.colors.primary} size={32} />
            <Text style={[theme.typography.caption, { color: theme.colors.primary, marginTop: theme.spacing.xs }]}>Take Photo</Text>
          </TouchableOpacity>
        )}

        {/* Voice */}
        <Text style={[theme.typography.label, styles.sectionTitle, { marginTop: theme.spacing.lg }]}>Voice</Text>
        {voiceRecord ? (
          <View style={styles.mediaPreview}>
            <Image source={voiceRecord} style={styles.mediaImg} contentFit="cover" />
            <View style={styles.voiceLabelOverlay}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Voice Content: 0:14s</Text>
            </View>
            <TouchableOpacity style={styles.removeMediaBtn} onPress={() => setVoiceRecord(null)}>
              <X color={theme.colors.surface} size={16} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.mediaUploadBtn} onPress={handleVoiceClick}>
            <Mic color={theme.colors.primary} size={32} />
            <Text style={[theme.typography.caption, { color: theme.colors.primary, marginTop: theme.spacing.xs }]}>Record Voice</Text>
          </TouchableOpacity>
        )}

        {/* Description */}
        <Text style={[theme.typography.label, styles.sectionTitle, { marginTop: theme.spacing.lg }]}>Describe the problem</Text>
        <TextInput
          placeholder="e.g. The sink is leaking under the cabinet..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          style={styles.textArea}
          textAlignVertical="top"
        />

        {/* Location Picker */}
        <View style={styles.locationHeaderRow}>
          <Text style={[theme.typography.label, styles.sectionTitle, { marginBottom: 0 }]}>Service Location</Text>
          <View style={styles.locationControls}>
            <TouchableOpacity style={styles.currentLocationBtn}>
              <Navigation color={theme.colors.primary} size={14} />
              <Text style={[theme.typography.caption, { color: theme.colors.primary, marginLeft: 4, fontWeight: '600' }]}>Use Current</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gearBtn} onPress={() => router.push('/new-request/radius-config')}>
              <Settings color={theme.colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mockMiniMap}>
          <View style={styles.mapGridPattern} />
          <MapPin color={theme.colors.error} size={32} style={styles.mapPin} />
          <View style={styles.mapOverlay} />
        </View>
        <TextInput
          placeholder="Enter complete address"
          value={address}
          onChangeText={setAddress}
          style={styles.addressInput}
        />

        {/* AI Workflow Info */}
        <View style={styles.infoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
            <Info color={theme.colors.primary} size={16} />
            <Text style={[theme.typography.label, { marginLeft: 8, color: theme.colors.primary }]}>How A-yos AI Works</Text>
          </View>
          <View style={{ marginLeft: 24 }}>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• Customer uploads a photo of the problem</Text>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• Customer records or enters a spoken or written description</Text>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• AI identifies the likely issue</Text>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• AI shows urgency, possible cause, suggested service category, estimated cost, and safety advice</Text>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• AI creates an editable request draft</Text>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• Customer can save the draft and continue later</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleNext} 
          disabled={!selectedCategory || description.length < 5 || address.length < 5}
          fullWidth 
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingVertical: theme.spacing.xl },
  title: { marginBottom: theme.spacing.xl, color: theme.colors.textPrimary },
  sectionTitle: { marginBottom: theme.spacing.sm, color: theme.colors.textPrimary },
  
  categoriesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xl },
  categoryItemRow: { width: '23%', height: 80, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  categoryItemSelected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.infoBackground },

  mediaUploadBtn: { width: '100%', height: 80, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.primary, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.infoBackground, marginBottom: theme.spacing.sm },
  mediaPreview: { width: '100%', height: 120, borderRadius: theme.radius.md, position: 'relative', overflow: 'hidden', marginBottom: theme.spacing.sm },
  mediaImg: { width: '100%', height: '100%', backgroundColor: theme.colors.border },
  voiceLabelOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)' },
  removeMediaBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.error, justifyContent: 'center', alignItems: 'center' },

  textArea: { minHeight: 100, backgroundColor: theme.colors.surface, marginBottom: theme.spacing.xl },

  locationHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  locationControls: { flexDirection: 'row', alignItems: 'center' },
  currentLocationBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.infoBackground, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: theme.spacing.sm },
  gearBtn: { padding: 4 },
  
  mockMiniMap: { height: 140, backgroundColor: '#e2e8f0', borderRadius: theme.radius.lg, marginBottom: theme.spacing.md, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  mapGridPattern: { position: 'absolute', width: '150%', height: '150%', borderWidth: 1, borderColor: '#cbd5e1', opacity: 0.5, borderRadius: 20 },
  mapPin: { zIndex: 2 },
  mapOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, backgroundColor: 'rgba(255,255,255,0.4)' },
  addressInput: { backgroundColor: theme.colors.surface, marginBottom: theme.spacing.xl },

  infoCard: { backgroundColor: theme.colors.infoBackground, borderRadius: theme.radius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.md },
  infoBullet: { color: theme.colors.textSecondary, marginBottom: 4, lineHeight: 18 },

  footer: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
});
