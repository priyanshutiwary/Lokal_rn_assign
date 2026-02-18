import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeStore } from '@/store/theme-store';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../components/ui/icon-symbol';

export default function SettingsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { theme, setTheme } = useThemeStore();

    const renderThemeOption = (label: string, value: 'light' | 'dark' | 'system') => (
        <TouchableOpacity
            className={`flex-row items-center justify-between p-4 rounded-xl border ${
                theme === value ? 'border-[#FF9500]' : 'border-transparent'
            }`}
            style={{ backgroundColor: themeColors.cardBackground }}
            onPress={() => setTheme(value)}
        >
            <Text className={colorScheme === 'dark' ? 'text-white text-[17px]' : 'text-black text-[17px]'}>
                {label}
            </Text>
            {theme === value && (
                <IconSymbol name="checkmark" size={20} color={themeColors.tint} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
            <ScrollView contentContainerClassName="p-5">
                <Text className={`text-[34px] font-bold mb-5 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Settings
                </Text>

                <View className="mb-7">
                    <Text className="text-[13px] font-semibold mb-2.5 ml-1 uppercase text-gray-500">
                        APPEARANCE
                    </Text>
                    <View className="gap-2.5">
                        {renderThemeOption('Light', 'light')}
                        {renderThemeOption('Dark', 'dark')}
                        {renderThemeOption('System', 'system')}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
