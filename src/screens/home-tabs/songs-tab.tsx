import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongListItem } from '@/components/ui/song-list-item';
import { SongOptionsModal } from '@/components/ui/song-options-modal';
import { SortMenu, SortOption } from '@/components/ui/sort-menu';
import { useMusicStore } from '@/store/music-store';
import { usePlayerStore } from '@/store/player-store';
import { Song, getImageUrl } from '../../services/api';

export function SongsTab() {
    const colorScheme = useColorScheme() ?? 'light';
    const { songs, isLoading, isOffline, _hasHydrated, fetchSongs, loadMoreSongs, hasMore } = useMusicStore();
    const { playSong } = usePlayerStore();
    const [sortOption, setSortOption] = useState<SortOption>('Ascending');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [selectedSong, setSelectedSong] = useState<any>(null);
    const [searchQuery] = useState('trending hindi');

    useEffect(() => {
        // Only fetch if hydration is complete and we have no cached data
        if (_hasHydrated && songs.length === 0) {
            fetchSongs(searchQuery);
        }
    }, [_hasHydrated]);

    const sortedData = useMemo(() => {
        return [...songs].sort((a, b) => {
            switch (sortOption) {
                case 'Ascending':
                    return a.name.localeCompare(b.name);
                case 'Descending':
                    return b.name.localeCompare(a.name);
                case 'Artist':
                    const artistA = a.artists.primary[0]?.name || a.primaryArtists || '';
                    const artistB = b.artists.primary[0]?.name || b.primaryArtists || '';
                    return artistA.localeCompare(artistB);
                case 'Album':
                    return a.album.name.localeCompare(b.album.name);
                case 'Year':
                    const yearA = String(a.year || '0');
                    const yearB = String(b.year || '0');
                    return yearB.localeCompare(yearA);
                default:
                    return 0;
            }
        });
    }, [songs, sortOption]);

    const handleSortOptionSelect = (option: SortOption) => {
        setSortOption(option);
    };

    const handleMorePress = (song: Song) => {
        setSelectedSong(song);
        setOptionsModalVisible(true);
    };

    if (isLoading && songs.length === 0) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#FF9500" />
                {isOffline && (
                    <Text className={`mt-4 text-center px-5 ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        No cached songs available
                    </Text>
                )}
            </View>
        );
    }

    if (!isLoading && songs.length === 0) {
        return (
            <View className="flex-1 items-center justify-center px-5">
                <IconSymbol name="music.note" size={64} color="#FF9500" />
                <Text className={`mt-4 text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                    No Songs Available
                </Text>
                <Text className={`mt-2 text-center ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isOffline 
                        ? 'No cached songs available. Connect to the internet to load songs.'
                        : 'Unable to load songs. Please try again later.'}
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
                        Offline - Showing cached songs
                    </Text>
                </View>
            )}

            {/* Header */}
            <View className="flex-row justify-between items-center px-5 mt-4 mb-4">
                <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {sortedData.length} songs
                </Text>
                <TouchableOpacity className="flex-row items-center gap-2" onPress={() => setSortMenuVisible(true)}>
                    <Text className="text-base font-bold text-[#FF9500]">
                        {sortOption}
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-gray-200 dark:bg-gray-900 mb-4 mx-5" />

            {/* List */}
            <FlatList
                data={sortedData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SongListItem
                        id={item.id}
                        title={item.name}
                        artist={item.artists.primary[0]?.name || item.primaryArtists || 'Unknown Artist'}
                        duration={`${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')} mins`}
                        image={getImageUrl(item.image, '150x150')}
                        onPlay={() => playSong(item, sortedData)}
                        onMore={() => handleMorePress(item)}
                    />
                )}
                contentContainerClassName="px-5 pb-5"
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (hasMore.songs && !isLoading) {
                        loadMoreSongs(searchQuery);
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isLoading && songs.length > 0 ? (
                        <View className="py-4">
                            <ActivityIndicator size="small" color="#FF9500" />
                        </View>
                    ) : null
                }
            />

            {/* Modals */}
            <SortMenu
                visible={sortMenuVisible}
                onClose={() => setSortMenuVisible(false)}
                selectedOption={sortOption}
                onSelectOption={handleSortOptionSelect}
            />

            <SongOptionsModal
                visible={optionsModalVisible}
                onClose={() => setOptionsModalVisible(false)}
                song={selectedSong}
                allSongs={sortedData}
            />
        </View >
    );
}
