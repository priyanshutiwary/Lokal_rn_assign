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
    const { songs, isLoading, fetchSongs } = useMusicStore();
    const { playSong } = usePlayerStore();
    const [sortOption, setSortOption] = useState<SortOption>('Ascending');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [selectedSong, setSelectedSong] = useState<any>(null);

    useEffect(() => {
        if (songs.length === 0) {
            fetchSongs('trending hindi');
        }
    }, []);

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
            </View>
        );
    }

    return (
        <View className="flex-1">
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
