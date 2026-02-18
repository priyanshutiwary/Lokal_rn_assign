import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

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
        <View className="items-center mr-4 w-[100px]">
            <Image source={{ uri: image }} className="w-[120px] h-[120px] rounded-full mb-2" />
            <Text className={`text-sm font-semibold text-center ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`} numberOfLines={1}>
                {name}
            </Text>
        </View>
    );
}
