import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RootStackParamList } from '@/navigation/types';
import { getAlbumById, Song, getImageUrl } from '../services/api';
import { usePlayerStore } from '@/store/player-store';

type AlbumDetailRouteProp = RouteProp<RootStackParamList, 'AlbumDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AlbumDetailScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AlbumDetailRouteProp>();
  
  const { album } = route.params;
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [albumDetails, setAlbumDetails] = useState<any>(null);
  const { playSong, playQueue } = usePlayerStore();

  useEffect(() => {
    const fetchAlbumData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching album with ID:', album.id);
        const details = await getAlbumById(album.id);
        console.log('Album details:', details);
        setAlbumDetails(details);
        
        // Check if songs exist in the response
        if (details?.songs && Array.isArray(details.songs)) {
          console.log('Found songs:', details.songs.length);
          setSongs(details.songs);
        } else {
          console.log('No songs found in album details');
          setSongs([]);
        }
      } catch (error) {
        console.error('Error fetching album data:', error);
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumData();
  }, [album.id]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = songs.reduce((acc, song) => acc + song.duration, 0);
  const totalMins = Math.floor(totalDuration / 60);

  return (
    <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 py-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="w-10 h-10 items-center justify-center"
            style={{ backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6', borderRadius: 20 }}
          >
            <Text style={{ fontSize: 20, color: colorScheme === 'dark' ? 'white' : 'black' }}>←</Text>
          </TouchableOpacity>
          <View className="flex-row gap-4">
            <TouchableOpacity>
              <IconSymbol name="magnifyingglass" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
            </TouchableOpacity>
            <TouchableOpacity>
              <IconSymbol name="ellipsis" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Album Image */}
        <View className="items-center mt-4 px-5">
          <Image
            source={{ uri: album.image }}
            style={{ width: 280, height: 280, borderRadius: 32 }}
            resizeMode="cover"
          />
        </View>

        {/* Album Title */}
        <Text className={`text-3xl font-bold text-center mt-6 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
          {album.title}
        </Text>

        {/* Stats */}
        <Text className="text-center text-gray-500 mt-2 text-base">
          {album.artist}
        </Text>
        <Text className="text-center text-gray-500 mt-1 text-base">
          1 Album  |  {songs.length} Songs  |  {Math.floor(totalMins / 60)}:{(totalMins % 60).toString().padStart(2, '0')}:{(totalDuration % 60).toString().padStart(2, '0')} mins
        </Text>

        {/* Action Buttons */}
        <View className="flex-row px-5 mt-6 gap-4">
          <TouchableOpacity 
            className="flex-1 bg-[#FF9500] py-4 rounded-full flex-row items-center justify-center gap-2"
            onPress={() => songs.length > 0 && playQueue(songs, true)}
          >
            <IconSymbol name="shuffle" size={20} color="white" />
            <Text className="text-white font-bold text-lg">Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 py-4 rounded-full flex-row items-center justify-center gap-2"
            style={{ backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFF7ED' }}
            onPress={() => songs.length > 0 && playQueue(songs, false)}
          >
            <IconSymbol name="play.fill" size={20} color="#FF9500" />
            <Text className="text-[#FF9500] font-bold text-lg">Play</Text>
          </TouchableOpacity>
        </View>

        {/* Songs Section */}
        <View className="mt-8 px-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-2xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
              Songs
            </Text>
            <TouchableOpacity>
              <Text className="text-[#FF9500] font-bold text-base">See All</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="py-10 items-center">
              <ActivityIndicator size="large" color="#FF9500" />
            </View>
          ) : songs.length === 0 ? (
            <View className="py-10 items-center">
              <Text className="text-gray-500 text-base">No songs available</Text>
            </View>
          ) : (
            <>
              {/* Song List */}
              {songs.map((song) => (
                <View key={song.id} className="flex-row items-center mb-4">
                  <Image
                    source={{ uri: getImageUrl(song.image, '150x150') }}
                    style={{ width: 64, height: 64, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-3">
                    <Text className={`text-lg font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {song.name}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      {song.artists.primary[0]?.name || song.primaryArtists || album.artist}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    className="w-10 h-10 bg-[#FF9500] rounded-full items-center justify-center mr-3"
                    onPress={() => playSong(song, songs)}
                  >
                    <IconSymbol name="play.fill" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <IconSymbol name="ellipsis" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
