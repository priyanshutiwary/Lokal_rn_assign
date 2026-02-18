import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from './icon-symbol';
import { RootStackParamList } from '@/navigation/types';
import { usePlayerStore } from '@/store/player-store';
import { getImageUrl } from '../../services/api';
import { MINI_PLAYER_HEIGHT } from '@/navigation/root-navigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function MiniPlayer() {
  const colorScheme = useColorScheme() ?? 'light';
  const navigation = useNavigation<NavigationProp>();
  
  const { currentSong, isPlaying, isLoading, togglePlayPause, playNext } = usePlayerStore();

  if (!currentSong) {
    return null;
  }

  const artistName = currentSong.artists?.primary?.[0]?.name || currentSong.primaryArtists || 'Unknown Artist';
  const albumArt = getImageUrl(currentSong.image, '150x150');

  return (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-3 border-t ${
        colorScheme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}
      style={styles.container}
      onPress={() => navigation.navigate('Player')}
      activeOpacity={0.9}
    >
      {/* Album Art */}
      <Image
        source={{ uri: albumArt }}
        style={{ width: 50, height: 50, borderRadius: 8 }}
        resizeMode="cover"
      />

      {/* Song Info */}
      <View className="flex-1 ml-3">
        <Text 
          className={`text-base font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}
          numberOfLines={1}
        >
          {currentSong.name}
        </Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
          {artistName}
        </Text>
      </View>

      {/* Controls */}
      <View className="flex-row items-center gap-4">
        <TouchableOpacity onPress={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF9500" />
          ) : (
            <IconSymbol 
              name={isPlaying ? 'pause.fill' : 'play.fill'} 
              size={24} 
              color="#FF9500" 
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={(e) => {
          e.stopPropagation();
          playNext();
        }}>
          <IconSymbol name="forward.fill" size={24} color="#FF9500" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: MINI_PLAYER_HEIGHT,
  },
});
