import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
// Removed expo-image-picker to fix Expo Go crash
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { Colors, Spacing, Layout, Typography } from '@/constants/theme';
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

  const pickImage = async (useCamera: boolean) => {
    if (photos.length >= 5) {
      Alert.alert('Limit Reached', 'You can only add up to 5 photos.');
      return;
    }

    // Mock image selection to avoid Expo Go native module errors
    const mockImageUri = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800';
    setPhotos((prev) => [...prev, mockImageUri]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateRequest({ photos, description, category });
    router.push('/request/ai-summary');
  };

  const isNextDisabled = description.trim().length === 0;

  return (
    <View style={styles.container}>
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
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
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
});
