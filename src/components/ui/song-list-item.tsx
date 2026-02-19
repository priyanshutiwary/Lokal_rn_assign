import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { FallbackImage } from './fallback-image';

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
        <View className="flex-row items-center py-3">
            <FallbackImage 
                uri={image} 
                fallbackIcon="music.note"
                style={{ width: 60, height: 60, borderRadius: 20, marginRight: 16 }}
            />

            <View className="flex-1 justify-center mr-2">
                <Text className={`text-base font-bold mb-1 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`} numberOfLines={1}>
                    {title}
                </Text>
                <Text className="text-sm text-gray-500" numberOfLines={1}>
                    {artist}  |  {duration}
                </Text>
            </View>

            <View className="flex-row items-center gap-4">
                <TouchableOpacity onPress={onPlay} className="w-8 h-8 rounded-full bg-[#FF9500] items-center justify-center">
                    <IconSymbol name="play.fill" size={16} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={onMore} className="p-1">
                    <IconSymbol name="more.vertical" size={24} color={themeColors.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
