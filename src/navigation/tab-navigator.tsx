import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import FavoritesScreen from '@/screens/favorites-screen';
import HomeScreen from '@/screens/home-screen';
import PlaylistsScreen from '@/screens/playlists-screen';
import SettingsScreen from '@/screens/settings-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import type { TabParamList } from './types';
import { TAB_BAR_HEIGHT, MINI_PLAYER_HEIGHT } from './root-navigator';
import { usePlayerStore } from '@/store/player-store';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const colorScheme = useColorScheme();
  const { currentSong } = usePlayerStore();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF9500', // Orange
        tabBarInactiveTintColor: '#9CA3AF', // Gray
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 0,
          elevation: 10, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: TAB_BAR_HEIGHT,
          paddingTop: 10,
          paddingBottom: 30, // Adjust for iPhone home indicator
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        // Add safe area for content to not go under tab bar + mini player (only when song is playing)
        sceneStyle: {
          paddingBottom: currentSong ? TAB_BAR_HEIGHT + MINI_PLAYER_HEIGHT : TAB_BAR_HEIGHT,
        }
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={focused ? "house.fill" : "house"} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={focused ? "heart.fill" : "heart"} color={color} />,
        }}
      />
      <Tab.Screen
        name="Playlists"
        component={PlaylistsScreen}
        options={{
          title: 'Playlists',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name="music.note.list" color={color} />, // Using same icon for now as 'doc.text' mapped to description matches image better
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
