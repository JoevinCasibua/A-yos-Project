export const Colors = {
  // Primary brand blues (applied system-wide)
  primary: '#0B63D6',
  primaryDark: '#0849A8',
  primaryMedium: '#0E73E6',
  primaryLight: '#4DA5FF',
  primarySurface: '#EAF4FF',
  primaryBorder: '#BDE1FF',

  // Accent / CTA
  cta: '#0B63D6',
  ctaPressed: '#0849A8',

  // Verified badge
  verified: '#0EA5A4',
  verifiedBg: '#E8FFF9',

  // Status colors
  success: '#117A5C',
  successBg: '#E8FFF7',
  warning: '#F59E0B',
  warningBg: '#FFF7ED',
  error: '#C53030',
  errorBg: '#FFF5F5',
  info: '#0B63D6',
  infoBg: '#EAF4FF',

  // Rating / star
  star: '#F59E0B',

  // Neutrals
  white: '#FFFFFF',
  background: '#F7F9FC',
  surfaceCard: '#FFFFFF',
  surfaceLight: '#FBFDFF',
  border: '#E6EBF6',
  borderLight: '#F1F5FB',
  divider: '#EEF4FB',

  // Text
  textPrimary: '#071022',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: '#0E73E6',

  // Navigation
  navActive: '#0B63D6',
  navInactive: '#9CA3AF',
  navBackground: '#FFFFFF',

  // Map / live tracking
  mapAccent: '#0B63D6',

  // Overlay
  overlay: 'rgba(0,0,0,0.4)',
  overlayLight: 'rgba(0,0,0,0.08)',
} as const;

export const Typography = {
  // Font families
  fontRegular: 'System',
  fontMedium: 'System',
  fontSemiBold: 'System',
  fontBold: 'System',

  // Font sizes (design system baseline for iPhone 15 viewport)
  Display: 40,
  H1: 36,
  H2: 32,
  H3: 28,
  Title: 24,
  Section: 20,
  Card: 18,
  Body: 16,
  Small: 14,
  Caption: 12,

  // Legacy/smaller tokens for components
  xs: 10,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 22,
  '4xl': 24,
  '5xl': 28,
  '6xl': 32,

  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.6,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
} as const;

export const Spacing = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '10': 40,
  '12': 48,
  '14': 56,
  '16': 64,
} as const;

// Layout tokens based on iPhone 15 (393x852 dp) baseline
export const Layout = {
  screenPadding: 20, // primary horizontal padding
  sectionSpacing: 24,
  cardPadding: 16,
  componentGap: 16,
  smallGap: 8,
  // Navigation / header
  navHeight: 80,
  headerHeight: 56,
} as const;

export const Radius = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 20,
  full: 9999,
} as const;

export const Elevation = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 12,
  },
} as const;

export const IconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
} as const;

export const AvatarSize = {
  small: 40,
  medium: 48,
  large: 64,
  xl: 96,
} as const;

export const ButtonSize = {
  height: 56,
  radius: 14,
  horizontalPadding: 20,
} as const;

export const TouchTarget = 44;
