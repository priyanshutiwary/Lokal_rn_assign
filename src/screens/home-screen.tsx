import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { SectionHeader } from '@/components/ui/section-header';
import { HorizontalCard } from '@/components/ui/horizontal-card';
import { ArtistAvatar } from '@/components/ui/artist-avatar';
import { SongsTab } from './home-tabs/songs-tab';
import { ArtistsTab } from './home-tabs/artists-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const TABS = ['Suggested', 'Songs', 'Artists', 'Albums', 'Folders'];

const RECENTLY_PLAYED = [
  { id: '1', title: 'Shades of Love', subtitle: 'Ania Szarmach', image: 'https://i.scdn.co/image/ab67616d0000b27341e31d6ea1d493dd7793385c' },
  { id: '2', title: 'Without You', subtitle: 'The Kid LAROI', image: 'https://upload.wikimedia.org/wikipedia/en/a/a2/The_Kid_Laroi_-_Without_You.png' },
  { id: '3', title: 'Save Your Tears', subtitle: 'The Weeknd', image: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Save_Your_Tears.png' },
];

const ARTISTS = [
  { id: '1', name: 'Ariana Grande', image: 'https://upload.wikimedia.org/wikipedia/en/4/47/Ariana_Grande_-_Dangerous_Woman_%28Official_Album_Cover%29.png' },
  { id: '2', name: 'The Weeknd', image: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png' },
  { id: '3', name: 'Acidrap', image: 'https://upload.wikimedia.org/wikipedia/en/d/db/Chance_the_Rapper_-_Acid_Rap.jpg' },
  { id: '4', name: 'Mac Miller', image: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Mac_Miller_-_Swimming.png' },
];

const MOST_PLAYED = [
  { id: '1', title: 'Man on the Moon', subtitle: 'Kid Cudi', image: 'https://upload.wikimedia.org/wikipedia/en/2/26/ManonTheMoonTheEndofDay.jpg' },
  { id: '2', title: 'Milky Way', subtitle: 'Bas', image: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Bas_-_Milky_Way.jpg' },
  { id: '3', title: 'Flower Boy', subtitle: 'Tyler, The Creator', image: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Tyler%2C_the_Creator_-_Flower_Boy.png' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [activeTab, setActiveTab] = useState('Suggested');

  const renderSuggestedContent = () => (
    <View>
      {/* Recently Played */}
      <SectionHeader title="Recently Played" onSeeAll={() => { }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {RECENTLY_PLAYED.map((item) => (
          <HorizontalCard key={item.id} {...item} />
        ))}
      </ScrollView>

      {/* Artists */}
      <SectionHeader title="Artists" onSeeAll={() => { }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {ARTISTS.map((item) => (
          <ArtistAvatar key={item.id} {...item} />
        ))}
      </ScrollView>

      {/* Most Played */}
      <SectionHeader title="Most Played" onSeeAll={() => { }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {MOST_PLAYED.map((item) => (
          <HorizontalCard key={item.id} {...item} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol name="music.note" size={24} color={themeColors.tint} />
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Mume</Text>
        </View>
        <TouchableOpacity>
          <IconSymbol name="magnifyingglass" size={24} color={themeColors.icon} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : { color: themeColors.icon }]}>{tab}</Text>
              {activeTab === tab && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>


        {activeTab === 'Suggested' ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {renderSuggestedContent()}
            <View style={{ height: 20 }} />
          </ScrollView>
        ) : null}

        {activeTab === 'Songs' ? <SongsTab /> : null}
        {activeTab === 'Artists' ? <ArtistsTab /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabsContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  tabsContent: {
    paddingHorizontal: 20,
  },
  tabItem: {
    marginRight: 24,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTabItem: {
    // borderBottomWidth: 3,
    // borderBottomColor: '#FF9500',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF9500',
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    height: 3,
    backgroundColor: '#FF9500',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
});
