import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './tab-navigator';
import ModalScreen from '@/screens/modal-screen';
import ArtistDetailScreen from '@/screens/artist-detail-screen';
import AlbumDetailScreen from '@/screens/album-detail-screen';
import SearchScreen from '@/screens/search-screen';
import PlayerScreen from '@/screens/player-screen';
import { MiniPlayer } from '@/components/ui/mini-player';
import { usePlayerStore } from '@/store/player-store';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Constants for fixed bottom elements
export const TAB_BAR_HEIGHT = 90;
export const MINI_PLAYER_HEIGHT = 76;
export const BOTTOM_SAFE_AREA = TAB_BAR_HEIGHT + MINI_PLAYER_HEIGHT;

function MainWithMiniPlayer() {
  const { currentSong } = usePlayerStore();
  
  return (
    <View style={styles.container}>
      <TabNavigator />
      {currentSong && (
        <View style={styles.miniPlayerContainer}>
          <MiniPlayer />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  miniPlayerContainer: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainWithMiniPlayer} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Modal" 
        component={ModalScreen} 
        options={{ presentation: 'modal', title: 'Modal' }} 
      />
      <Stack.Screen 
        name="ArtistDetail" 
        component={ArtistDetailScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="AlbumDetail" 
        component={AlbumDetailScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Player" 
        component={PlayerScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
