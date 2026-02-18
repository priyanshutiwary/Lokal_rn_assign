import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useThemeStore } from '@/store/theme-store';

export function useColorScheme() {
    const { theme } = useThemeStore();
    const systemTheme = useNativeColorScheme();

    if (theme === 'system') {
        return systemTheme;
    }

    return theme;
}
