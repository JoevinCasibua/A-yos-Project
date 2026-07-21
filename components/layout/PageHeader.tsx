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
      <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
        <ChevronLeft size={24} color={theme.colors.textPrimary} />
      </Pressable>
      <Text style={theme.typography.h4}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.layout.screenPadding,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
