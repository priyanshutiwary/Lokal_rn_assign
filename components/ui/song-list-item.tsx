import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SongListItemProps {
    id: string;
    image: string;
    title: string;
    artist: string;
    duration: string;
    onPlay?: () => void;
    onMore?: () => void;
}

export function SongListItem({
    image,
    title,
    artist,
    duration,
    onPlay,
    onMore,
}: SongListItemProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <View style={styles.container}>
            <Image source={{ uri: image }} style={styles.image} contentFit="cover" />

            <View style={styles.infoContainer}>
                <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={[styles.subtitle, { color: themeColors.icon }]} numberOfLines={1}>
                    {artist}  |  {duration}
                </Text>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={onPlay} style={styles.playButton}>
                    <IconSymbol name="play.fill" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={onMore} style={styles.moreButton}>
                    <IconSymbol name="ellipsis" size={20} color={themeColors.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'transparent', // Can add separator color if needed
    },
    image: {
        width: 56,
        height: 56,
        borderRadius: 16,
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    playButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FF9500', // Orange
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreButton: {
        padding: 4,
    },
});
