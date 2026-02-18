import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface HorizontalCardProps {
    image: string;
    title: string;
    subtitle: string;
}

export function HorizontalCard({ image, title, subtitle }: HorizontalCardProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <View style={styles.container}>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>{title}</Text>
            <Text style={[styles.subtitle, { color: themeColors.icon }]} numberOfLines={1}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 140,
        marginRight: 16,
    },
    image: {
        width: 140,
        height: 140,
        borderRadius: 20,
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
});
