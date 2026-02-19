import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { FallbackImage } from './fallback-image';

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
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="flex-row items-center py-3">
            <FallbackImage 
                uri={image} 
                fallbackIcon="person.circle"
                rounded
                style={{ width: 70, height: 70, borderRadius: 35, marginRight: 16 }}
            />

            <View className="flex-1 justify-center mr-2">
                <Text className={`text-lg font-bold mb-1 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`} numberOfLines={1}>
                    {name}
                </Text>
                {(albumCount > 0 || songCount > 0) && (
                    <Text className="text-sm text-gray-500 font-medium" numberOfLines={1}>
                        {albumCount > 0 && `${albumCount} ${albumCount === 1 ? 'Album' : 'Albums'}`}
                        {albumCount > 0 && songCount > 0 && '  |  '}
                        {songCount > 0 && `${songCount} ${songCount === 1 ? 'Song' : 'Songs'}`}
                    </Text>
                )}
                {albumCount === 0 && songCount === 0 && (
                    <Text className="text-sm text-gray-500 font-medium" numberOfLines={1}>
                        Artist
                    </Text>
                )}
            </View>

            <TouchableOpacity onPress={onMore} className="p-1">
                <IconSymbol name="more.vertical" size={24} color={themeColors.icon} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
