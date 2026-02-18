import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ArtistListItem } from '@/components/ui/artist-list-item';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
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
    const themeColors = Colors[colorScheme];
    const [sortOption, setSortOption] = useState<SortOption>('Date Added');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    // Sort direction state for simpler toggle if not using full menu logic, 
    // but here we use the specific SortOption values
    const [isAscending, setIsAscending] = useState(false); // Default to Descending for 'Date Added' usually? Image shows 'Date Added' with up/down arrows

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

        // Toggle direction if needed (for simplicity in this mock, we might just rely on the specific option or a separate toggle)
        // For the 'Date Added' example in the image, it implies a toggle. 
        if (!isAscending && sortOption === 'Date Added') {
            data.reverse();
        }

        return data;
    }, [sortOption, isAscending]);

    const handleSortToggle = () => {
        // If it's already a directional sort, maybe flip it? 
        // Or specific logic for 'Date Added'
        setIsAscending(!isAscending);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.countText, { color: themeColors.text }]}>
                    {ARTISTS_DATA.length} artists
                </Text>
                <TouchableOpacity style={styles.sortButton} onPress={() => setSortMenuVisible(true)}>
                    <Text style={styles.sortText}>
                        {sortOption}
                    </Text>
                    <IconSymbol name="arrow.up.arrow.down" size={14} color="#FF9500" />
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={sortedData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ArtistListItem
                        {...item}
                        onMore={() => console.log('More', item.name)}
                        onPress={() => console.log('Press', item.name)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <SortMenu
                visible={sortMenuVisible}
                onClose={() => setSortMenuVisible(false)}
                selectedOption={sortOption}
                onSelectOption={(option) => {
                    setSortOption(option);
                    // Reset direction logic if needed when changing sort type
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    countText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sortText: {
        fontSize: 14,
        color: '#FF9500',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});
