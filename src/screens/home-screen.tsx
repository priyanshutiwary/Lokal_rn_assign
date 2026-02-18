import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

const TABS = ['Suggested', 'Songs', 'Artists', 'Albums', 'Folders'];

const RECENTLY_PLAYED = [
  { id: '1', title: 'Shades of Love', subtitle: 'Ania Szarmach', image: 'https://i.scdn.co/image/ab67616d0000b27341e31d6ea1d493dd7793385c' },
  { id: '2', title: 'Without You', subtitle: 'The Kid LAROI', image: 'https://upload.wikimedia.org/wikipedia/en/a/a2/The_Kid_Laroi_-_Without_You.png' },
  { id: '3', title: 'Save Your Tears', subtitle: 'The Weeknd', image: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Save_Your_Tears.png' },
];

const ARTISTS = [
  { id: '1', name: 'Ariana Grande', image: 'https://upload.wikimedia.org/wikipedia/en/4/47/Ariana_Grande_-_Dangerous_Woman_%28Official_Album_Cover%29.png', albumCount: 1, songCount: 20 },
  { id: '2', name: 'The Weeknd', image: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', albumCount: 1, songCount: 16 },
  { id: '3', name: 'Acidrap', image: 'https://upload.wikimedia.org/wikipedia/en/d/db/Chance_the_Rapper_-_Acid_Rap.jpg', albumCount: 2, songCount: 28 },
  { id: '4', name: 'Mac Miller', image: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Mac_Miller_-_Swimming.png', albumCount: 1, songCount: 14 },
];

const MOST_PLAYED = [
  { id: '1', title: 'Man on the Moon', subtitle: 'Kid Cudi', image: 'https://upload.wikimedia.org/wikipedia/en/2/26/ManonTheMoonTheEndofDay.jpg' },
  { id: '2', title: 'Milky Way', subtitle: 'Bas', image: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Bas_-_Milky_Way.jpg' },
  { id: '3', title: 'Flower Boy', subtitle: 'Tyler, The Creator', image: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Tyler%2C_the_Creator_-_Flower_Boy.png' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('Suggested');

  const renderSuggestedContent = () => (
    <View>
      {/* Recently Played */}
      <SectionHeader title="Recently Played" onSeeAll={() => { }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5">
        {RECENTLY_PLAYED.map((item) => (
          <HorizontalCard key={item.id} {...item} />
        ))}
      </ScrollView>

      {/* Artists */}
      <SectionHeader title="Artists" onSeeAll={() => { }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5">
        {ARTISTS.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => navigation.navigate('ArtistDetail', { artist: item })}>
            <ArtistAvatar {...item} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Most Played */}
      <SectionHeader title="Most Played" onSeeAll={() => { }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5">
        {MOST_PLAYED.map((item) => (
          <HorizontalCard key={item.id} {...item} />
        ))}
      </ScrollView>
    </View>
  );

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
