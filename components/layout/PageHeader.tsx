import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';

interface PageHeaderProps {
  title: string;
  from?: string;
}

export function PageHeader({ title, from }: PageHeaderProps) {
  const handleBack = () => {
    if (from === 'profile') router.push('/(worker)/profile');
    else if (from === 'settings') router.push('/(worker)/settings');
    else router.back();
  };

  return (
    <View style={styles.header}>
      <View style={styles.sideSlot}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.textPrimary} />
        </Pressable>
      </View>
      <Text style={[theme.typography.h4, styles.title]}>{title}</Text>
      <View style={styles.sideSlot} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.layout.screenPadding,
  },
  sideSlot: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});
