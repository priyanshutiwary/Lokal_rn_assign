import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ArtistListItemProps {
    id: string;
    image: string;
    name: string;
    albumCount: number;
    songCount: number;
    onMore?: () => void;
    onPress?: () => void;
}

export function ArtistListItem({
    image,
    name,
    albumCount,
    songCount,
    onMore,
    onPress,
}: ArtistListItemProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
            <Image source={{ uri: image }} style={styles.image} contentFit="cover" />

            <View style={styles.infoContainer}>
                <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={[styles.stats, { color: themeColors.icon }]} numberOfLines={1}>
                    {albumCount} {albumCount === 1 ? 'Album' : 'Albums'}  |  {songCount} {songCount === 1 ? 'Song' : 'Songs'}
                </Text>
            </View>

            <TouchableOpacity onPress={onMore} style={styles.moreButton}>
                <IconSymbol name="ellipsis" size={20} color={themeColors.icon} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'transparent',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30, // Circular image
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    stats: {
        fontSize: 14,
    },
    moreButton: {
        padding: 4,
    },
});
