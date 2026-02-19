import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ArtistOptionsModal } from '@/components/ui/artist-options-modal';
import { ArtistListItem } from '@/components/ui/artist-list-item';
import { SortMenu, SortOption } from '@/components/ui/sort-menu';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useMusicStore } from '@/store/music-store';
import { getImageUrl } from '../../services/api';

export function ArtistsTab() {
    const colorScheme = useColorScheme() ?? 'light';
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { artists, isLoading, isOffline, _hasHydrated, fetchArtists, loadMoreArtists, hasMore } = useMusicStore();
    const [sortOption, setSortOption] = useState<SortOption>('Date Added');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [isAscending, setIsAscending] = useState(false);
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<any>(null);
    const [searchQuery] = useState('bollywood');

    useEffect(() => {
        // Only fetch if hydration is complete and we have no cached data
        if (_hasHydrated && artists.length === 0) {
            fetchArtists(searchQuery);
        }
    }, [_hasHydrated]);

    const handleMorePress = (artist: any) => {
        setSelectedArtist({
            id: artist.id,
            name: artist.name,
            image: getImageUrl(artist.image, '500x500'),
            albumCount: artist.topAlbums?.length || 0,
            songCount: artist.topSongs?.length || 0
        });
        setOptionsModalVisible(true);
    };

    const handleArtistPress = (artist: any) => {
        navigation.navigate('ArtistDetail', { 
            artist: {
                id: artist.id,
                name: artist.name,
                image: getImageUrl(artist.image, '500x500'),
                albumCount: artist.topAlbums?.length || 0,
                songCount: artist.topSongs?.length || 0
            }
        });
    };

    const sortedData = useMemo(() => {
        let data = [...artists];

        data.sort((a, b) => {
            switch (sortOption) {
                case 'Artist':
                case 'Ascending':
                    return a.name.localeCompare(b.name);
                case 'Descending':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

        return data;
    }, [artists, sortOption, isAscending]);

    if (isLoading && artists.length === 0) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#FF9500" />
                {isOffline && (
                    <Text className={`mt-4 text-center px-5 ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        No cached artists available
                    </Text>
                )}
            </View>
        );
    }

    if (!isLoading && artists.length === 0) {
        return (
            <View className="flex-1 items-center justify-center px-5">
                <IconSymbol name="person.2" size={64} color="#FF9500" />
                <Text className={`mt-4 text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                    No Artists Available
                </Text>
                <Text className={`mt-2 text-center ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isOffline 
                        ? 'No cached artists available. Connect to the internet to load artists.'
                        : 'Unable to load artists. Please try again later.'}
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
                        Offline - Showing cached artists
                    </Text>
                </View>
            )}

            <View className="flex-row justify-between items-center px-5 mt-4 mb-4">
                <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {sortedData.length} artists
                </Text>
                <TouchableOpacity className="flex-row items-center gap-2" onPress={() => setSortMenuVisible(true)}>
                    <Text className="text-base font-bold text-[#FF9500]">
                        {sortOption}
                    </Text>
                    <IconSymbol name="arrow.up.arrow.down" size={20} color="#FF9500" />
                </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-gray-200 dark:bg-gray-900 mb-4 mx-5" />

            {/* List */}
            <FlatList
                data={sortedData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ArtistListItem
                        id={item.id}
                        name={item.name}
                        image={getImageUrl(item.image, '150x150')}
                        albumCount={item.topAlbums?.length || 0}
                        songCount={item.topSongs?.length || 0}
                        onMore={() => handleMorePress(item)}
                        onPress={() => handleArtistPress(item)}
                    />
                )}
                contentContainerClassName="px-5 pb-5"
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (hasMore.artists && !isLoading) {
                        loadMoreArtists(searchQuery);
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isLoading && artists.length > 0 ? (
                        <View className="py-4">
                            <ActivityIndicator size="small" color="#FF9500" />
                        </View>
                    ) : null
                }
            />

            <SortMenu
                visible={sortMenuVisible}
                onClose={() => setSortMenuVisible(false)}
                selectedOption={sortOption}
                onSelectOption={(option) => {
                    setSortOption(option);
                }}
            />

            <ArtistOptionsModal
                visible={optionsModalVisible}
                onClose={() => setOptionsModalVisible(false)}
                artist={selectedArtist}
            />
        </View >
    );
}
