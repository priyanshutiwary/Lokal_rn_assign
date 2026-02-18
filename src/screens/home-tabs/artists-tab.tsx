import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ArtistOptionsModal } from '@/components/ui/artist-options-modal';
import { ArtistListItem } from '@/components/ui/artist-list-item';
import { SortMenu, SortOption } from '@/components/ui/sort-menu';

interface Artist {
    id: string;
    name: string;
    image: string;
    albumCount: number;
    songCount: number;
    dateAdded: string; // for sorting
}

// Mock Data matching the image provided by user
const ARTISTS_DATA: Artist[] = [
    { id: '1', name: 'Ariana Grande', image: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Ariana_Grande_-_Dangerous_Woman_live.jpg', albumCount: 1, songCount: 20, dateAdded: '2023-01-01' },
    { id: '2', name: 'The Weeknd', image: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', albumCount: 1, songCount: 16, dateAdded: '2023-01-02' },
    { id: '3', name: 'Acidrap', image: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Acid_Rap.jpg', albumCount: 2, songCount: 28, dateAdded: '2023-01-03' },
    { id: '4', name: 'Ania Szarmarch', image: 'https://i.scdn.co/image/ab67616d0000b273d2890656041ec35222055106', albumCount: 1, songCount: 12, dateAdded: '2023-01-04' },
    { id: '5', name: 'Troye Sivan', image: 'https://upload.wikimedia.org/wikipedia/en/7/76/Blue_Neighbourhood.png', albumCount: 1, songCount: 14, dateAdded: '2023-01-05' },
    { id: '6', name: 'Ryan Jones', image: 'https://i.scdn.co/image/ab67616d0000b273ac6b1947e09623812895669f', albumCount: 2, songCount: 24, dateAdded: '2023-01-06' },
];

export function ArtistsTab() {
    const colorScheme = useColorScheme() ?? 'light';
    const [sortOption, setSortOption] = useState<SortOption>('Date Added');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [isAscending, setIsAscending] = useState(false);
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

    const handleMorePress = (artist: Artist) => {
        setSelectedArtist(artist);
        setOptionsModalVisible(true);
    };

    const sortedData = useMemo(() => {
        let data = [...ARTISTS_DATA];

        // Basic sorting logic based on the selected option
        data.sort((a, b) => {
            switch (sortOption) {
                case 'Date Added':
                    // Mock date sorting
                    return a.dateAdded.localeCompare(b.dateAdded);
                case 'Artist': // Sort by Name
                case 'Ascending':
                    return a.name.localeCompare(b.name);
                case 'Descending':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

        return data;
    }, [sortOption, isAscending]);

    return (
        <View className="flex-1">

            <View className="flex-row justify-between items-center px-5 mt-4 mb-4">
                <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {ARTISTS_DATA.length} artists
                </Text>
                <TouchableOpacity className="flex-row items-center gap-2" onPress={() => setSortMenuVisible(true)}>
                    <Text className="text-base font-bold text-[#FF9500]">
                        {sortOption}
                    </Text>
                    <IconSymbol name="arrow.up.arrow.down" size={20} color="#FF9500" />
                </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-gray-100 dark:bg-gray-800 mb-4 mx-5" />

            {/* List */}
            <FlatList
                data={sortedData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ArtistListItem
                        {...item}
                        onMore={() => handleMorePress(item)}
                        onPress={() => console.log('Press', item.name)}
                    />
                )}
                contentContainerClassName="px-5 pb-5"
                showsVerticalScrollIndicator={false}
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
