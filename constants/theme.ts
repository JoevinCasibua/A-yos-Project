export const Colors = {
  // Primary brand greens
  primary: '#1B5E20',
  primaryDark: '#0A3D0A',
  primaryMedium: '#2E7D32',
  primaryLight: '#4CAF50',
  primarySurface: '#E8F5E9',
  primaryBorder: '#A5D6A7',

  // Accent / CTA
  cta: '#1B5E20',
  ctaPressed: '#0A3D0A',

  // Verified badge
  verified: '#2E7D32',
  verifiedBg: '#E8F5E9',

  // Status colors
  success: '#2E7D32',
  successBg: '#E8F5E9',
  warning: '#F9A825',
  warningBg: '#FFF8E1',
  error: '#C62828',
  errorBg: '#FFEBEE',
  info: '#1565C0',
  infoBg: '#E3F2FD',

  // Rating / star
  star: '#FFB800',

  // Neutrals
  white: '#FFFFFF',
  background: '#F5F6FA',
  surfaceCard: '#FFFFFF',
  surfaceLight: '#F9FAFB',
  border: '#E5E7EB',
  borderLight: '#F0F1F3',
  divider: '#EEEEEE',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#2E7D32',

  // Navigation
  navActive: '#1B5E20',
  navInactive: '#9CA3AF',
  navBackground: '#FFFFFF',

  // Map / live tracking
  mapAccent: '#1B5E20',

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

  // Font sizes
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

export const Radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
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

export const TouchTarget = 44;
