import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, View } from 'react-native';

export default function PlaylistsScreen() {
    const colorScheme = useColorScheme() ?? 'light';

    return (
        <View className={`flex-1 items-center justify-center ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
            <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                Playlists
            </Text>
        </View>
    );
}
