import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeStore } from '@/store/theme-store';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SettingsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { theme, setTheme } = useThemeStore();

    const renderThemeOption = (label: string, value: 'light' | 'dark' | 'system') => (
        <TouchableOpacity
            style={[
                styles.optionRow,
                {
                    backgroundColor: themeColors.cardBackground,
                    borderColor: theme === value ? themeColors.tint : 'transparent',
                    borderWidth: 1
                }
            ]}
            onPress={() => setTheme(value)}
        >
            <Text style={[styles.optionText, { color: themeColors.text }]}>{label}</Text>
            {theme === value && (
                <IconSymbol name="checkmark" size={20} color={themeColors.tint} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.headerTitle, { color: themeColors.text }]}>Settings</Text>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: themeColors.icon }]}>APPEARANCE</Text>
                    <View style={styles.optionsContainer}>
                        {renderThemeOption('Light', 'light')}
                        {renderThemeOption('Dark', 'dark')}
                        {renderThemeOption('System', 'system')}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 10,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    optionsContainer: {
        gap: 10,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
    },
    optionText: {
        fontSize: 17,
        fontWeight: '400',
    },
});
