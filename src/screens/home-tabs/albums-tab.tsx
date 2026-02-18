import { AlbumGridItem } from '@/components/ui/album-grid-item';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SortMenu, SortOption } from '@/components/ui/sort-menu';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

interface Album {
    id: string;
    title: string;
    artist: string;
    year: string;
    songCount: number;
    image: string;
    dateModified: string;
}

const ALBUMS_DATA: Album[] = [
    { id: '1', title: 'Dawn FM', artist: 'The Weeknd', year: '2022', songCount: 16, image: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', dateModified: '2023-01-01' },
    { id: '2', title: 'Sweetener', artist: 'Ariana Grande', year: '2021', songCount: 16, image: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Ariana_Grande_-_Dangerous_Woman_live.jpg', dateModified: '2023-01-02' },
    { id: '3', title: 'First Impact', artist: 'Treasure', year: '2021', songCount: 14, image: 'https://i.scdn.co/image/ab67616d0000b273d2890656041ec35222055106', dateModified: '2023-01-03' },
    { id: '4', title: 'Pain (Official)', artist: 'Ryan Jones', year: '2021', songCount: 18, image: 'https://i.scdn.co/image/ab67616d0000b273ac6b1947e09623812895669f', dateModified: '2023-01-04' },
    { id: '5', title: 'Blue Neighbourhood', artist: 'Troye Sivan', year: '2015', songCount: 14, image: 'https://upload.wikimedia.org/wikipedia/en/7/76/Blue_Neighbourhood.png', dateModified: '2023-01-05' },
    { id: '6', title: 'Acid Rap', artist: 'Chance the Rapper', year: '2013', songCount: 28, image: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Acid_Rap.jpg', dateModified: '2023-01-06' },
];

export function AlbumsTab() {
    const colorScheme = useColorScheme() ?? 'light';
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [sortOption, setSortOption] = useState<SortOption>('Date Modified');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);

    const sortedData = useMemo(() => {
        return [...ALBUMS_DATA].sort((a, b) => {
            switch (sortOption) {
                case 'Ascending':
                    return a.title.localeCompare(b.title);
                case 'Descending':
                    return b.title.localeCompare(a.title);
                case 'Date Modified':
                    return b.dateModified.localeCompare(a.dateModified);
                default:
                    return 0;
            }
        });
    }, [sortOption]);

    const handleAlbumPress = (album: Album) => {
        navigation.navigate('AlbumDetail', { album });
    };

    return (
        <View className="flex-1">
            <View className="flex-row justify-between items-center px-5 mt-4 mb-4">
                <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {ALBUMS_DATA.length} albums
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
                        {...item}
                        onPress={() => handleAlbumPress(item)}
                        onMore={() => console.log('More', item.title)}
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
