import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, X, ChevronLeft, CircleCheck, Circle } from 'lucide-react-native';
import { Colors, Spacing, Layout, Typography, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { Chip } from '@/components/Chip';
import { useRequest } from '@/context/RequestContext';

const CATEGORIES = ['Plumbing', 'Electrical', 'Carpentry', 'Appliance', 'Painting', 'Other'];

export default function CreateRequestScreen() {
  const router = useRouter();
  const { request, updateRequest } = useRequest();
  
  const [photos, setPhotos] = useState<string[]>(request.photos || []);
  const [description, setDescription] = useState(request.description || '');
  const [category, setCategory] = useState(request.category || '');
  const [hasParts, setHasParts] = useState<boolean | null>(request.hasParts !== undefined ? request.hasParts : null);
  const [partsDescription, setPartsDescription] = useState(request.partsDescription || '');

  const pickImage = async (useCamera: boolean) => {
    if (photos.length >= 5) {
      Alert.alert('Limit Reached', 'You can only add up to 5 photos.');
      return;
    }

    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Permission required', `Allow ${useCamera ? 'camera' : 'photo'} access to add service photos.`); return; }
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) setPhotos((prev) => [...prev, result.assets[0].uri]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateRequest({ photos, description, category, hasParts, partsDescription });
    router.push('/new-request/issue-summary' as any);
  };

  const isNextDisabled = description.trim().length === 0 || hasParts === null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>New Request</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Photo Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>Photos ({photos.length}/5)</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoScroll}>
            {photos.map((uri, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri }} style={styles.photo} />
                <Pressable style={styles.removePhotoBtn} onPress={() => removePhoto(index)}>
                  <X size={16} color={Colors.white} />
                </Pressable>
              </View>
            ))}
            
            {photos.length < 5 && (
              <View style={styles.addPhotoButtons}>
                <Pressable style={styles.addBtn} onPress={() => pickImage(true)}>
                  <Camera size={24} color={Colors.cta} />
                  <AppText variant="caption" style={{ color: Colors.cta, marginTop: 4 }}>Camera</AppText>
                </Pressable>
                <Pressable style={styles.addBtn} onPress={() => pickImage(false)}>
                  <ImageIcon size={24} color={Colors.cta} />
                  <AppText variant="caption" style={{ color: Colors.cta, marginTop: 4 }}>Gallery</AppText>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>What needs fixing?</AppText>
          <AppInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the issue in detail..."
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </View>

        {/* Category Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>Category (Optional)</AppText>
          <View style={styles.chipContainer}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                selected={category === cat}
                onPress={() => setCategory(category === cat ? '' : cat)}
                style={styles.chip}
              />
            ))}
          </View>
        </View>

        {/* Replacement Parts Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>Replacement Parts</AppText>
          <AppText variant="body" color={Colors.textSecondary} style={{ marginBottom: Spacing[3] }}>
            Do you already have the replacement parts needed for this service?
          </AppText>

          <Pressable 
            style={[styles.optionCard, hasParts === true && styles.optionCardSelected]}
            onPress={() => setHasParts(true)}
          >
            {hasParts === true ? <CircleCheck size={24} color={Colors.primary} /> : <Circle size={24} color={Colors.border} />}
            <View style={styles.optionContent}>
              <AppText variant="body" weight="semiBold" color={hasParts === true ? Colors.primary : Colors.textPrimary}>I Have the Parts</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>I already have the replacement parts needed for this service.</AppText>
            </View>
          </Pressable>

          <Pressable 
            style={[styles.optionCard, hasParts === false && styles.optionCardSelected]}
            onPress={() => {
              setHasParts(false);
              setPartsDescription('');
            }}
          >
            {hasParts === false ? <CircleCheck size={24} color={Colors.primary} /> : <Circle size={24} color={Colors.border} />}
            <View style={styles.optionContent}>
              <AppText variant="body" weight="semiBold" color={hasParts === false ? Colors.primary : Colors.textPrimary}>I Need the Service Provider to Bring the Parts</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>I don&apos;t have the required parts and would like the service provider to bring them if needed.</AppText>
            </View>
          </Pressable>

          {hasParts === true && (
            <View style={{ marginTop: Spacing[3] }}>
              <AppInput
                label="Parts Description (Optional)"
                placeholder="Example: Kitchen faucet, LED bulb, Aircon capacitor, Door lock"
                value={partsDescription}
                onChangeText={setPartsDescription}
              />
            </View>
          )}
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton 
          label="Next" 
          onPress={handleNext} 
          disabled={isNextDisabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 60, // Safe area approx
    paddingBottom: Spacing[4],
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: Layout.screenPadding,
    paddingBottom: 40,
  },
  section: {
    marginBottom: Layout.sectionSpacing,
  },
  sectionTitle: {
    marginBottom: Spacing[3],
    fontWeight: '600',
  },
  photoScroll: {
    gap: Spacing[3],
    paddingVertical: 4,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginRight: Spacing[3],
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  addPhotoButtons: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  addBtn: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.cta,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceCard,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chip: {
    marginBottom: Spacing[2],
  },
  footer: {
    padding: Layout.screenPadding,
    backgroundColor: Colors.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    marginBottom: Spacing[3],
    backgroundColor: Colors.white,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  optionContent: {
    flex: 1,
    marginLeft: Spacing[3],
  }
});
