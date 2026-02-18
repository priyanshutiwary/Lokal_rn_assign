import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongOptionsModal } from '@/components/ui/song-options-modal';
import { ArtistOptionsModal } from '@/components/ui/artist-options-modal';
import { RootStackParamList } from '@/navigation/types';
import { searchSongs, searchArtists, searchAlbums, Song, Artist, Album, getImageUrl } from '../services/api';
import { usePlayerStore } from '@/store/player-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SearchTab = 'Songs' | 'Artists' | 'Albums' | 'Folders';

const RECENT_SEARCHES_KEY = '@recent_searches';

export default function SearchScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const navigation = useNavigation<NavigationProp>();
  const { playSong } = usePlayerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('Songs');
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [artistOptionsModalVisible, setArtistOptionsModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length > 0) {
      // Debounce search - wait 500ms after user stops typing
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(false); // false = don't save to history
      }, 500);
    } else {
      setSongs([]);
      setArtists([]);
      setAlbums([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, activeTab]);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const removeRecentSearch = async (query: string) => {
    try {
      const updated = recentSearches.filter(s => s !== query);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing recent search:', error);
    }
  };

  const clearAllRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const performSearch = async (saveToHistory: boolean = false) => {
    if (searchQuery.trim().length === 0) return;

    setIsSearching(true);
    try {
      if (activeTab === 'Songs') {
        const results = await searchSongs(searchQuery, 100);
        setSongs(results);
      } else if (activeTab === 'Artists') {
        const results = await searchArtists(searchQuery, 100);
        setArtists(results);
      } else if (activeTab === 'Albums') {
        const results = await searchAlbums(searchQuery, 100);
        setAlbums(results);
      }
      
      // Only save to history if explicitly requested (e.g., when clicking a result)
      if (saveToHistory && searchQuery.trim()) {
        saveRecentSearch(searchQuery.trim());
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    // This will trigger the search via useEffect, but won't save again since it's already in history
  };

  const handleItemPress = (callback: () => void) => {
    // Save current search to history when user clicks on a result
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
    }
    callback();
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity 
      className="flex-row items-center px-5 py-3"
      onPress={() => handleItemPress(() => playSong(item, songs))}
    >
      <Image
        source={{ uri: getImageUrl(item.image, '150x150') }}
        style={{ width: 60, height: 60, borderRadius: 12 }}
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <Text className={`text-base font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`} numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
          {item.artists.primary[0]?.name || item.primaryArtists || 'Unknown Artist'}
        </Text>
      </View>
      <TouchableOpacity 
        className="w-10 h-10 bg-[#FF9500] rounded-full items-center justify-center mr-3"
        onPress={(e) => {
          e.stopPropagation();
          handleItemPress(() => playSong(item, songs));
        }}
      >
        <IconSymbol name="play.fill" size={16} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={(e) => {
        e.stopPropagation();
        setSelectedSong(item);
        setOptionsModalVisible(true);
      }}>
        <IconSymbol name="ellipsis" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderArtistItem = ({ item }: { item: Artist }) => (
    <TouchableOpacity 
      className="flex-row items-center px-5 py-3"
      onPress={() => handleItemPress(() => {
        navigation.navigate('ArtistDetail', {
          artist: {
            id: item.id,
            name: item.name,
            image: getImageUrl(item.image, '500x500'),
            albumCount: item.topAlbums?.length || 0,
            songCount: item.topSongs?.length || 0
          }
        });
      })}
    >
      <Image
        source={{ uri: getImageUrl(item.image, '150x150') }}
        style={{ width: 60, height: 60, borderRadius: 30 }}
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <Text className={`text-base font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`} numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
          Artist
        </Text>
      </View>
      <TouchableOpacity onPress={(e) => {
        e.stopPropagation();
        setSelectedArtist({
          id: item.id,
          name: item.name,
          image: getImageUrl(item.image, '500x500'),
          albumCount: item.topAlbums?.length || 0,
          songCount: item.topSongs?.length || 0
        });
        setArtistOptionsModalVisible(true);
      }}>
        <IconSymbol name="ellipsis" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAlbumItem = ({ item }: { item: Album }) => (
    <TouchableOpacity 
      className="flex-row items-center px-5 py-3"
      onPress={() => handleItemPress(() => {
        navigation.navigate('AlbumDetail', {
          album: {
            id: item.id,
            title: item.name,
            artist: item.primaryArtists || 'Various Artists',
            year: item.year || '',
            songCount: item.songCount || 0,
            image: getImageUrl(item.image, '500x500')
          }
        });
      })}
    >
      <Image
        source={{ uri: getImageUrl(item.image, '150x150') }}
        style={{ width: 60, height: 60, borderRadius: 12 }}
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <Text className={`text-base font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`} numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
          {item.primaryArtists || 'Various Artists'}
        </Text>
      </View>
      <TouchableOpacity onPress={(e) => {
        e.stopPropagation();
        console.log('Album options:', item.name);
      }}>
        <IconSymbol name="ellipsis" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-10 pt-20">
      <View className="w-48 h-48 items-center justify-center mb-6">
        <Text style={{ fontSize: 100 }}>😞</Text>
      </View>
      <Text className={`text-2xl font-bold mb-3 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
        Not Found
      </Text>
      <Text className="text-center text-gray-500 text-base leading-6">
        Sorry, the keyword you entered cannot be found, please check again or search with another keyword.
      </Text>
    </View>
  );

  const renderRecentSearches = () => (
    <View className="flex-1">
      <View className="flex-row justify-between items-center px-5 py-4">
        <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
          Recent Searches
        </Text>
        <TouchableOpacity onPress={clearAllRecentSearches}>
          <Text className="text-[#FF9500] font-semibold text-base">Clear All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={recentSearches}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="flex-row items-center justify-between px-5 py-4"
            onPress={() => handleRecentSearchPress(item)}
          >
            <Text className="text-gray-500 text-base flex-1">{item}</Text>
            <TouchableOpacity onPress={() => removeRecentSearch(item)} className="p-2">
              <Text className="text-gray-400 text-xl">×</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const hasResults = songs.length > 0 || artists.length > 0 || albums.length > 0;
  const showEmptyState = searchQuery.trim().length > 0 && !isSearching && !hasResults;

  return (
    <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 gap-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, color: colorScheme === 'dark' ? 'white' : 'black' }}>←</Text>
        </TouchableOpacity>
        
        <View 
          className="flex-1 flex-row items-center px-4 py-3 rounded-full"
          style={{ backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F5F5F5' }}
        >
          <IconSymbol name="magnifyingglass" size={20} color="#FF9500" />
          <TextInput
            className={`flex-1 ml-2 text-base ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}
            placeholder="Search songs, artists, albums..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text className="text-gray-400 text-xl">×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      {searchQuery.trim().length > 0 && (
        <View className="px-5 py-3">
          <View className="flex-row gap-3">
            {(['Songs', 'Artists', 'Albums', 'Folders'] as SearchTab[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full ${
                  activeTab === tab ? 'bg-[#FF9500]' : ''
                }`}
                style={activeTab !== tab ? { 
                  borderWidth: 2, 
                  borderColor: '#FF9500',
                  backgroundColor: 'transparent'
                } : {}}
              >
                <Text className={`font-semibold ${
                  activeTab === tab ? 'text-white' : 'text-[#FF9500]'
                }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Content */}
      {searchQuery.trim().length === 0 ? (
        renderRecentSearches()
      ) : isSearching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      ) : showEmptyState ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={activeTab === 'Songs' ? songs : activeTab === 'Artists' ? artists : albums}
          keyExtractor={(item) => item.id}
          renderItem={activeTab === 'Songs' ? renderSongItem : activeTab === 'Artists' ? renderArtistItem : renderAlbumItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Song Options Modal */}
      <SongOptionsModal
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        song={selectedSong}
        allSongs={songs}
      />

      {/* Artist Options Modal */}
      <ArtistOptionsModal
        visible={artistOptionsModalVisible}
        onClose={() => setArtistOptionsModalVisible(false)}
        artist={selectedArtist}
      />
    </SafeAreaView>
  );
}
