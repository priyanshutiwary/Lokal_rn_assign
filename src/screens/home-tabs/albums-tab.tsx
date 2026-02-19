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
    const { albums, isLoading, isOffline, _hasHydrated, fetchAlbums, loadMoreAlbums, hasMore } = useMusicStore();
    const [sortOption, setSortOption] = useState<SortOption>('Date Modified');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [searchQuery] = useState('hindi');

    useEffect(() => {
        // Only fetch if hydration is complete and we have no cached data
        if (_hasHydrated && albums.length === 0) {
            fetchAlbums(searchQuery);
        }
    }, [_hasHydrated]);

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
                {isOffline && (
                    <Text className={`mt-4 text-center px-5 ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        No cached albums available
                    </Text>
                )}
            </View>
        );
    }

    if (!isLoading && albums.length === 0) {
        return (
            <View className="flex-1 items-center justify-center px-5">
                <IconSymbol name="square.stack" size={64} color="#FF9500" />
                <Text className={`mt-4 text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                    No Albums Available
                </Text>
                <Text className={`mt-2 text-center ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isOffline 
                        ? 'No cached albums available. Connect to the internet to load albums.'
                        : 'Unable to load albums. Please try again later.'}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            {/* Offline Indicator */}
            {isOffline && (
                <View className="bg-yellow-500 mx-5 mt-4 px-3 py-2 rounded-lg">
                    <Text className="text-center text-sm font-semibold text-black">
                        Offline - Showing cached albums
                    </Text>
                </View>
            )}

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
                onEndReached={() => {
                    if (hasMore.albums && !isLoading) {
                        loadMoreAlbums(searchQuery);
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isLoading && albums.length > 0 ? (
                        <View className="py-4 col-span-2">
                            <ActivityIndicator size="small" color="#FF9500" />
                        </View>
                    ) : null
                }
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
