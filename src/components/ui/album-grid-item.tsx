import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface AlbumGridItemProps {
    image: string;
    title: string;
    artist: string;
    year: string;
    songCount: number;
    onPress?: () => void;
    onMore?: () => void;
}

export function AlbumGridItem({
    image,
    title,
    artist,
    year,
    songCount,
    onPress,
    onMore,
}: AlbumGridItemProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <TouchableOpacity
            className="flex-1 m-2"
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: image }}
                className="w-full aspect-square rounded-[20px] mb-3"
                contentFit="cover"
            />

            <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-2">
                    <Text
                        className={`text-base font-bold mb-1 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    <Text className="text-sm text-gray-500 mb-1" numberOfLines={1}>
                        {artist} | {year}
                    </Text>
                    <Text className="text-sm text-gray-500" numberOfLines={1}>
                        {songCount} {songCount === 1 ? 'song' : 'songs'}
                    </Text>
                </View>

                <TouchableOpacity onPress={onMore} hitSlop={10}>
                    <IconSymbol name="more.vertical" size={20} color={themeColors.icon} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}
