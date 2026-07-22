import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Dimensions } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/layout/EmptyState';
import { theme } from '@/constants/theme';
import { workerProfile } from '@/constants/workerData';
import { Image } from 'expo-image';
import { X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMNS = 2;
const GAP = theme.spacing.sm;
const TILE_SIZE = (SCREEN_WIDTH - theme.layout.screenPadding * 2 - GAP) / COLUMNS;

export default function PortfolioScreen() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const images = workerProfile.portfolioImages;

  if (images.length === 0) {
    return (
      <Screen safeArea>
        <PageHeader title="Portfolio" from="profile" />
        <EmptyState
          icon={ImageIcon}
          title="No Portfolio Items"
          description="Start adding photos of your completed work to showcase your skills to potential customers."
        />
      </Screen>
    );
  }

  return (
    <Screen safeArea scrollable>
      <PageHeader title="Portfolio" from="profile" />

      <View style={styles.grid}>
        {images.map((uri, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [styles.tile, { opacity: pressed ? 0.9 : 1 }]}
            onPress={() => setSelectedImage(index)}
          >
            <Image source={uri} style={styles.tileImage} contentFit="cover" />
          </Pressable>
        ))}
      </View>

      <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, textAlign: 'center', marginTop: theme.spacing.md }]}>
        {images.length} {images.length === 1 ? 'photo' : 'photos'}
      </Text>

      <Modal visible={selectedImage !== null} transparent animationType="fade">
        {selectedImage !== null && (
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalClose} onPress={() => setSelectedImage(null)}>
              <X color="#fff" size={28} />
            </Pressable>

            {selectedImage > 0 && (
              <Pressable
                style={[styles.navButton, styles.navLeft]}
                onPress={() => setSelectedImage((prev) => (prev !== null ? prev - 1 : prev))}
              >
                <ChevronLeft color="#fff" size={32} />
              </Pressable>
            )}

            <Image source={images[selectedImage]} style={styles.modalImage} contentFit="contain" />

            {selectedImage < images.length - 1 && (
              <Pressable
                style={[styles.navButton, styles.navRight]}
                onPress={() => setSelectedImage((prev) => (prev !== null ? prev + 1 : prev))}
              >
                <ChevronRight color="#fff" size={32} />
              </Pressable>
            )}

            <Text style={styles.modalCounter}>
              {selectedImage + 1} / {images.length}
            </Text>
          </View>
        )}
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingHorizontal: theme.layout.screenPadding,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.border,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  modalImage: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_WIDTH - 40,
    borderRadius: theme.radius.lg,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLeft: { left: 12 },
  navRight: { right: 12 },
  modalCounter: {
    position: 'absolute',
    bottom: 50,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
