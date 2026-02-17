import { createContext, useContext } from 'react';
import { Colors, type ThemeColors } from '@/src/constants/theme';

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  colors: Colors.light,
  isDark: false,
});

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
