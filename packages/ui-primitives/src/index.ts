export const theme = {
  colors: {
    background: '#0B0F1A',
    surface: '#12121A',
    surfaceLight: '#1A1A2E',
    border: 'rgba(255,255,255,0.10)',
    borderLight: 'rgba(255,255,255,0.06)',
    primary: '#F97316',
    primaryLight: '#FB923C',
    primaryDark: '#EA580C',
    accent: '#84CC16',
    accentLight: '#A3E635',
    accentDark: '#65A30D',
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.65)',
    textMuted: 'rgba(255,255,255,0.40)',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    purple: '#C455FF',
    blue: '#64B5F6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    xs: 12,
    sm: 13,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 5,
    },
  },
} as const;

export type Theme = typeof theme;

export const darkTheme = theme;

export const lightTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceLight: '#F3F4F6',
    border: 'rgba(0,0,0,0.10)',
    borderLight: 'rgba(0,0,0,0.06)',
    text: '#111827',
    textSecondary: 'rgba(0,0,0,0.65)',
    textMuted: 'rgba(0,0,0,0.40)',
  },
};