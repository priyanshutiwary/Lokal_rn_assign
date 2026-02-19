import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FallbackImage } from './fallback-image';

interface ArtistAvatarProps {
    id: string;
    image: string;
    name: string;
}

export function ArtistAvatar({ image, name }: ArtistAvatarProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <View className="items-center mr-4 w-[120px]">
            <FallbackImage 
                uri={image} 
                fallbackIcon="person.circle"
                rounded
                style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 8 }}
            />
            <Text className={`text-sm font-semibold text-center ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`} numberOfLines={1}>
                {name}
            </Text>
        </View>
    );
}
