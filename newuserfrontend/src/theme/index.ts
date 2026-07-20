export const colors = {
  primary: '#2563eb', // Blue-600
  primaryLight: '#60a5fa', // Blue-400
  primaryDark: '#1e40af', // Blue-800
  secondary: '#10b981', // Emerald-500
  secondaryLight: '#34d399', // Emerald-400
  secondaryDark: '#047857', // Emerald-700
  accent: '#f59e0b', // Amber-500
  background: '#f8fafc', // Slate-50
  surface: '#ffffff',
  textPrimary: '#0f172a', // Slate-900
  textSecondary: '#64748b', // Slate-500
  textTertiary: '#94a3b8', // Slate-400
  border: '#e2e8f0', // Slate-200
  borderLight: '#f1f5f9', // Slate-100
  error: '#ef4444', // Red-500
  errorBackground: '#fef2f2', // Red-50
  success: '#10b981', // Emerald-500
  successBackground: '#ecfdf5', // Emerald-50
  warning: '#f59e0b', // Amber-500
  warningBackground: '#fffbeb', // Amber-50
  info: '#3b82f6', // Blue-500
  infoBackground: '#eff6ff', // Blue-50
  overlay: 'rgba(0, 0, 0, 0.4)',
  transparent: 'transparent',
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32, letterSpacing: -0.5 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 28 },
  body1: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const layout = {
  screenPadding: spacing.md,
  headerHeight: 60,
  bottomNavHeight: 65,
};

export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  spring: {
    damping: 20,
    stiffness: 90,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  layout,
  animations,
};

export type Theme = typeof theme;
export default theme;
