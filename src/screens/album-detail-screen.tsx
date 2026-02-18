import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RootStackParamList } from '@/navigation/types';

type AlbumDetailRouteProp = RouteProp<RootStackParamList, 'AlbumDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Song {
  id: string;
  title: string;
  artist: string;
  image: string;
  duration: string;
}

const MOCK_SONGS: Song[] = [
  { id: '1', title: 'Take My Breath', artist: 'The Weeknd', image: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', duration: '03:40' },
  { id: '2', title: 'A Tale by Quincy', artist: 'The Weeknd', image: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', duration: '00:57' },
  { id: '3', title: 'Out of Time', artist: 'The Weeknd', image: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', duration: '03:34' },
];

export default function AlbumDetailScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AlbumDetailRouteProp>();
  
  const { album } = route.params;

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
          1 Album  |  {album.songCount} Songs  |  01:20:38 mins
        </Text>

        {/* Action Buttons */}
        <View className="flex-row px-5 mt-6 gap-4">
          <TouchableOpacity className="flex-1 bg-[#FF9500] py-4 rounded-full flex-row items-center justify-center gap-2">
            <IconSymbol name="shuffle" size={20} color="white" />
            <Text className="text-white font-bold text-lg">Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 py-4 rounded-full flex-row items-center justify-center gap-2"
            style={{ backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFF7ED' }}
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

          {/* Song List */}
          {MOCK_SONGS.map((song) => (
            <View key={song.id} className="flex-row items-center mb-4">
              <Image
                source={{ uri: song.image }}
                style={{ width: 64, height: 64, borderRadius: 12 }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text className={`text-lg font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {song.title}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">{song.artist}</Text>
              </View>
              <TouchableOpacity className="w-10 h-10 bg-[#FF9500] rounded-full items-center justify-center mr-3">
                <IconSymbol name="play.fill" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <IconSymbol name="ellipsis" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
