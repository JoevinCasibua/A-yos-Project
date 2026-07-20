import React from 'react';
import { View, StyleSheet, SafeAreaView, ViewStyle, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  safeArea?: boolean;
  keyboardAvoiding?: boolean;
  backgroundColor?: string;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  safeArea = true,
  keyboardAvoiding = true,
  backgroundColor = theme.colors.background,
}) => {
  const insets = useSafeAreaInsets();

  const Container = View;
  
  const content = scrollable ? (
    <ScrollView 
      style={styles.flex} 
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.content, contentContainerStyle]}>
      {children}
    </View>
  );

  const wrapper = keyboardAvoiding ? (
    <KeyboardAvoidingView 
      style={styles.flex} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  ) : content;

  return (
    <Container style={[
      styles.container, 
      { backgroundColor },
      safeArea && { paddingTop: insets.top, paddingBottom: insets.bottom },
      style
    ]}>
      {wrapper}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  scrollContent: {
    paddingHorizontal: theme.layout.screenPadding,
    flexGrow: 1,
  },
});
