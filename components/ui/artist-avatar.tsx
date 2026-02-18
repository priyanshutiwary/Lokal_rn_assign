import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ArtistAvatarProps {
    image: string;
    name: string;
}

export function ArtistAvatar({ image, name }: ArtistAvatarProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <View style={styles.container}>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 16,
        width: 100,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
