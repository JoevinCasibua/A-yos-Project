import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { getBackRoute } from '@/constants/backRoutes';

export const PAGE_HEADER_HEIGHT = 56;

interface PageHeaderProps {
  title: string;
  from?: string;
  variant?: 'default' | 'light';
  rightElement?: React.ReactNode;
}

export function PageHeader({ title, from, variant = 'default', rightElement }: PageHeaderProps) {
  const isLight = variant === 'light';

  const handleBack = () => {
    const route = getBackRoute(from);
    route ? router.push(route) : router.back();
  };

  return (
    <View style={[styles.header, isLight && styles.headerLight]}>
      <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
        <ArrowLeft color={isLight ? theme.colors.surface : theme.colors.textPrimary} size={24} />
      </Pressable>
      <Text style={[theme.typography.h4, styles.title, isLight && styles.titleLight]}>{title}</Text>
      {rightElement || <View style={styles.spacer} />}
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
  headerLight: {
    backgroundColor: 'transparent',
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
  titleLight: {
    color: theme.colors.surface,
  },
  spacer: {
    width: 40,
  },
});
