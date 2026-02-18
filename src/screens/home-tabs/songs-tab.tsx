import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongListItem } from '@/components/ui/song-list-item';
import { SongOptionsModal } from '@/components/ui/song-options-modal';
import { SortMenu, SortOption } from '@/components/ui/sort-menu';

interface Song {
    id: string;
    title: string;
    artist: string;
    duration: string;
    image: string;
    album: string;
    year: number;
    dateAdded: string;
}

const SONGS_DATA: Song[] = [
    { id: '1', title: 'Starboy', artist: 'The Weeknd, Daft Punk', duration: '03:50 mins', image: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', album: 'Starboy', year: 2016, dateAdded: '2023-01-01' },
    { id: '2', title: 'Disaster', artist: 'Conan Gray', duration: '03:58 mins', image: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Conan_Gray_-_Disaster.png', album: 'Superache', year: 2022, dateAdded: '2023-02-01' },
    { id: '3', title: 'HANDSOME', artist: 'Warren Hue', duration: '04:45 mins', image: 'https://i.scdn.co/image/ab67616d0000b273e86c9c6123307774e1792695', album: 'Boy of the Year', year: 2022, dateAdded: '2023-03-01' },
    { id: '4', title: 'Sharks', artist: 'Imagine Dragons', duration: '05:23 mins', image: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Imagine_Dragons_-_Sharks.png', album: 'Mercury - Acts 1 & 2', year: 2022, dateAdded: '2023-04-01' },
    { id: '5', title: 'Fly Me To The Sun', artist: 'Romantic Echoes', duration: '04:20 mins', image: 'https://i.scdn.co/image/ab67616d0000b273d2890656041ec35222055106', album: 'Paradisa', year: 2021, dateAdded: '2023-05-01' },
    { id: '6', title: 'The Bended Man', artist: 'Sunwich', duration: '03:48 mins', image: 'https://i.scdn.co/image/ab67616d0000b273ac6b1947e09623812895669f', album: 'The Bended Man', year: 2020, dateAdded: '2023-06-01' },
];

export function SongsTab() {
    const colorScheme = useColorScheme() ?? 'light';
    const [sortOption, setSortOption] = useState<SortOption>('Ascending');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);

    const sortedData = useMemo(() => {
        return [...SONGS_DATA].sort((a, b) => {
            switch (sortOption) {
                case 'Ascending':
                    return a.title.localeCompare(b.title);
                case 'Descending':
                    return b.title.localeCompare(a.title);
                case 'Artist':
                    return a.artist.localeCompare(b.artist);
                case 'Album':
                    return a.album.localeCompare(b.album);
                case 'Year':
                    return b.year - a.year; // Newest first
                case 'Date Added':
                    return b.dateAdded.localeCompare(a.dateAdded); // Newest first
                default:
                    return 0;
            }
        });
    }, [sortOption]);

    const handleSortOptionSelect = (option: SortOption) => {
        setSortOption(option);
    };

    const handleMorePress = (song: Song) => {
        setSelectedSong(song);
        setOptionsModalVisible(true);
    };

    return (
        <View className="flex-1">
            {/* Header */}
            <View className="flex-row justify-between items-center px-5 mt-4 mb-4">
                <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {SONGS_DATA.length} songs
                </Text>
                <TouchableOpacity className="flex-row items-center gap-2" onPress={() => setSortMenuVisible(true)}>
                    <Text className="text-base font-bold text-[#FF9500]">
                        {sortOption}
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-gray-100 dark:bg-gray-800 mb-4 mx-5" />

            {/* List */}
            <FlatList
                data={sortedData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }: { item: Song }) => (
                    <SongListItem
                        {...item}
                        onPlay={() => console.log('Play', item.title)}
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
            />
        </View >
    );
}
