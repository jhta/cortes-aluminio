const tintColorLight = '#D97706';
const tintColorDark = '#F59E0B';

export const Colors = {
  light: {
    text: '#1C1C1E',
    textSecondary: '#6B7280',
    background: '#F5F3EF',
    surface: '#FFFFFF',
    tint: tintColorLight,
    tintText: '#FFFFFF',
    icon: '#6B7280',
    border: '#E2DFD8',
    inputBackground: '#FFFFFF',
    inputBorder: '#D1CDC4',
    resultBackground: '#FFFBF5',
    resultBorder: '#F0DFC4',
  },
  dark: {
    text: '#F3F4F6',
    textSecondary: '#9CA3AF',
    background: '#18181B',
    surface: '#27272A',
    tint: tintColorDark,
    tintText: '#18181B',
    icon: '#9CA3AF',
    border: '#3F3F46',
    inputBackground: '#27272A',
    inputBorder: '#52525B',
    resultBackground: '#292524',
    resultBorder: '#44403C',
  },
};

export type ThemeColors = typeof Colors.light;
