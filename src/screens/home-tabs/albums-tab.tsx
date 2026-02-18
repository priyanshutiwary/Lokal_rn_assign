import { AlbumGridItem } from '@/components/ui/album-grid-item';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SortMenu, SortOption } from '@/components/ui/sort-menu';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useMusicStore } from '@/store/music-store';
import { getImageUrl } from '../../services/api';

export function AlbumsTab() {
    const colorScheme = useColorScheme() ?? 'light';
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { albums, isLoading, fetchAlbums } = useMusicStore();
    const [sortOption, setSortOption] = useState<SortOption>('Date Modified');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);

    useEffect(() => {
        if (albums.length === 0) {
            fetchAlbums('hindi');
        }
    }, []);

    const sortedData = useMemo(() => {
        return [...albums].sort((a, b) => {
            switch (sortOption) {
                case 'Ascending':
                    return a.name.localeCompare(b.name);
                case 'Descending':
                    return b.name.localeCompare(a.name);
                case 'Date Modified':
                    const yearA = String(a.year || '0');
                    const yearB = String(b.year || '0');
                    return yearB.localeCompare(yearA);
                default:
                    return 0;
            }
        });
    }, [albums, sortOption]);

    const handleAlbumPress = (album: any) => {
        navigation.navigate('AlbumDetail', { 
            album: {
                id: album.id,
                title: album.name,
                artist: album.primaryArtists || 'Various Artists',
                year: album.year || '',
                songCount: album.songCount || 0,
                image: getImageUrl(album.image, '500x500')
            }
        });
    };

    if (isLoading && albums.length === 0) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#FF9500" />
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="flex-row justify-between items-center px-5 mt-4 mb-4">
                <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {sortedData.length} albums
                </Text>
                <TouchableOpacity className="flex-row items-center gap-2" onPress={() => setSortMenuVisible(true)}>
                    <Text className="text-base font-bold text-[#FF9500]">
                        {sortOption}
                    </Text>
                    <IconSymbol name="arrow.up.arrow.down" size={20} color="#FF9500" />
                </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-gray-200 dark:bg-gray-900 mb-4 mx-5" />

            <FlatList
                data={sortedData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AlbumGridItem
                        id={item.id}
                        title={item.name}
                        artist={item.primaryArtists || 'Various Artists'}
                        year={item.year || ''}
                        songCount={item.songCount || 0}
                        image={getImageUrl(item.image, '500x500')}
                        onPress={() => handleAlbumPress(item)}
                        onMore={() => console.log('More', item.name)}
                    />
                )}
                numColumns={2}
                contentContainerClassName="px-3 pb-5"
                columnWrapperClassName="justify-between"
                showsVerticalScrollIndicator={false}
            />

            <SortMenu
                visible={sortMenuVisible}
                onClose={() => setSortMenuVisible(false)}
                selectedOption={sortOption}
                onSelectOption={setSortOption}
            />
        </View>
    );
}
