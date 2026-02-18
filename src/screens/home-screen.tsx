import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ArtistAvatar } from '@/components/ui/artist-avatar';
import { HorizontalCard } from '@/components/ui/horizontal-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SectionHeader } from '@/components/ui/section-header';
import { AlbumsTab } from './home-tabs/albums-tab';
import { ArtistsTab } from './home-tabs/artists-tab';
import { SongsTab } from './home-tabs/songs-tab';
import { RootStackParamList } from '@/navigation/types';
import { useMusicStore } from '@/store/music-store';
import { usePlayerStore } from '@/store/player-store';
import { getImageUrl } from '../services/api';

const TABS = ['Suggested', 'Songs', 'Artists', 'Albums', 'Folders'];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('Suggested');
  
  const { songs, albums, artists, isLoading, fetchSongs, fetchAlbums, fetchArtists } = useMusicStore();
  const { playSong } = usePlayerStore();

  useEffect(() => {
    // Fetch initial data with popular queries
    fetchSongs('arijit singh');
    fetchAlbums('bollywood');
    fetchArtists('arijit singh');
  }, []);

  const recentlyPlayed = songs.slice(0, 3);
  const topArtists = artists.slice(0, 4);
  const mostPlayed = songs.slice(3, 6);

  const renderSuggestedContent = () => {
    if (isLoading && songs.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      );
    }

    return (
      <View>
        {/* Recently Played */}
        <SectionHeader title="Recently Played" onSeeAll={() => { }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5">
          {recentlyPlayed.map((song) => (
            <HorizontalCard 
              key={song.id} 
              title={song.name} 
              subtitle={song.artists.primary[0]?.name || song.primaryArtists || 'Unknown Artist'} 
              image={getImageUrl(song.image, '150x150')}
              onPress={() => playSong(song, songs)}
            />
          ))}
        </ScrollView>

        {/* Artists */}
        <SectionHeader title="Artists" onSeeAll={() => { }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5">
          {topArtists.map((artist) => {
            const imageUrl = getImageUrl(artist.image, '500x500');
            console.log(`Artist ${artist.name} image:`, imageUrl);
            return (
              <TouchableOpacity 
                key={artist.id} 
                onPress={() => navigation.navigate('ArtistDetail', { 
                  artist: {
                    id: artist.id,
                    name: artist.name,
                    image: imageUrl,
                    albumCount: artist.topAlbums?.length || 0,
                    songCount: artist.topSongs?.length || 0
                  }
                })}
              >
                <ArtistAvatar 
                  id={artist.id}
                  name={artist.name} 
                  image={imageUrl} 
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Most Played */}
        <SectionHeader title="Most Played" onSeeAll={() => { }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5">
          {mostPlayed.map((song) => (
            <HorizontalCard 
              key={song.id} 
              title={song.name} 
              subtitle={song.artists.primary[0]?.name || song.primaryArtists || 'Unknown Artist'} 
              image={getImageUrl(song.image, '150x150')}
              onPress={() => playSong(song, songs)}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4">
        <View className="flex-row items-center gap-3">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFEDD5' }} // Orange-100 equivalent
          >
            <IconSymbol name="music.note" size={24} color="#FF9500" />
          </View>
          <Text className={`text-3xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
            Mume
          </Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6' }} // Gray-100 equivalent
          onPress={() => navigation.navigate('Search')}
        >
          <IconSymbol name="magnifyingglass" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="mt-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 32 }}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              className="pb-3 items-center"
              onPress={() => setActiveTab(tab)}
            >
              <Text className={`text-lg font-bold ${activeTab === tab
                ? 'text-[#FF9500]'
                : 'text-gray-400'
                }`}>
                {tab}
              </Text>
              {activeTab === tab && <View className="h-[3px] bg-[#FF9500] w-full absolute bottom-0 rounded-full" />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Full width separator line */}
        <View className="h-[1px] bg-gray-200 dark:bg-gray-900 w-full mt-[-1px]" />
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === 'Suggested' ? (
          <ScrollView contentContainerClassName="pb-5" showsVerticalScrollIndicator={false}>
            {renderSuggestedContent()}
            <View className="h-5" />
          </ScrollView>
        ) : null}

        {activeTab === 'Songs' ? <SongsTab /> : null}
        {activeTab === 'Artists' ? <ArtistsTab /> : null}
        {activeTab === 'Albums' ? <AlbumsTab /> : null}
      </View>
    </SafeAreaView>
  );
}
