import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

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
        <View className="w-[140px] mr-4">
            <Image source={{ uri: image }} className="w-[140px] h-[140px] rounded-[20px] mb-2" />
            <Text className={`text-base font-bold mb-1 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`} numberOfLines={1}>
                {title}
            </Text>
            <Text className="text-sm text-gray-500" numberOfLines={1}>
                {subtitle}
            </Text>
        </View>
    );
}
