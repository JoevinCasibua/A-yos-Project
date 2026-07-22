import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';

export const PAGE_HEADER_HEIGHT = 56;

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
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <ArrowLeft color={theme.colors.textPrimary} size={24} />
      </TouchableOpacity>
      <Text style={[theme.typography.h4, styles.title]}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.layout.screenPadding,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.textPrimary,
  },
  spacer: {
    width: 40,
  },
});
