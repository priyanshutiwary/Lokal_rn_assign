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
    const { artists, isLoading, fetchArtists } = useMusicStore();
    const [sortOption, setSortOption] = useState<SortOption>('Date Added');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [isAscending, setIsAscending] = useState(false);
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<any>(null);

    useEffect(() => {
        if (artists.length === 0) {
            fetchArtists('bollywood');
        }
    }, []);

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
            </View>
        );
    }

    return (
        <View className="flex-1">

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
