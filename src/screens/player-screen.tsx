import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LyricsModal } from '@/components/ui/lyrics-modal';
import { FallbackImage } from '@/components/ui/fallback-image';
import { RootStackParamList } from '@/navigation/types';
import Slider from '@react-native-community/slider';
import { usePlayerStore } from '@/store/player-store';
import { getImageUrl } from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlayerScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const navigation = useNavigation<NavigationProp>();
  const [showLyrics, setShowLyrics] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  const { 
    currentSong, 
    isPlaying,
    isLoading,
    currentTime, 
    duration,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo
  } = usePlayerStore();

  if (!currentSong) {
    return (
      <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">No song playing</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const artistName = currentSong.artists?.primary?.[0]?.name || currentSong.primaryArtists || 'Unknown Artist';
  const albumArt = getImageUrl(currentSong.image, '500x500');

  return (
    <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 py-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <IconSymbol name="chevron.left" size={28} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <IconSymbol name="ellipsis" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
        </View>

        {/* Album Art */}
        <View className="items-center px-8 mt-4">
          <FallbackImage
            uri={albumArt}
            fallbackIcon="music.note"
            style={{ width: 340, height: 340, borderRadius: 20 }}
          />
        </View>

        {/* Song Info */}
        <View className="px-8 mt-8">
          <Text className={`text-2xl font-bold text-center ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
            {currentSong.name}
          </Text>
          <Text className="text-center text-gray-500 text-base mt-2">
            {artistName}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="px-8 mt-8">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={duration || 1}
            value={currentTime}
            onSlidingComplete={seekTo}
            minimumTrackTintColor="#FF9500"
            maximumTrackTintColor={colorScheme === 'dark' ? '#374151' : '#E5E7EB'}
            thumbTintColor="#FF9500"
          />
          <View className="flex-row justify-between mt-[-8px]">
            <Text className="text-gray-500 text-sm">{formatTime(currentTime)}</Text>
            <Text className="text-gray-500 text-sm">{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Main Controls */}
        <View className="flex-row items-center justify-center px-8 mt-6" style={{ gap: 20 }}>
          {/* Previous */}
          <TouchableOpacity 
            onPress={playPrevious} 
            className="w-12 h-12 items-center justify-center"
            style={{ 
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6',
              borderRadius: 24
            }}
          >
            <IconSymbol name="backward.fill" size={28} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>

          {/* Rewind 10s */}
          <TouchableOpacity 
            className="w-12 h-12 items-center justify-center"
            onPress={() => seekTo(Math.max(0, currentTime - 10))}
            style={{ 
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6',
              borderRadius: 24
            }}
          >
            <IconSymbol name="gobackward.10" size={28} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>

          {/* Play/Pause */}
          <TouchableOpacity 
            className="w-16 h-16 bg-[#FF9500] rounded-full items-center justify-center"
            onPress={togglePlayPause}
            disabled={isLoading}
            style={{ elevation: 4, shadowColor: '#FF9500', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <IconSymbol 
                name={isPlaying ? 'pause.fill' : 'play.fill'} 
                size={28} 
                color="white" 
              />
            )}
          </TouchableOpacity>

          {/* Forward 10s */}
          <TouchableOpacity 
            className="w-12 h-12 items-center justify-center"
            onPress={() => seekTo(Math.min(duration, currentTime + 10))}
            style={{ 
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6',
              borderRadius: 24
            }}
          >
            <IconSymbol name="goforward.10" size={28} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>

          {/* Next */}
          <TouchableOpacity 
            onPress={playNext} 
            className="w-12 h-12 items-center justify-center"
            style={{ 
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6',
              borderRadius: 24
            }}
          >
            <IconSymbol name="forward.fill" size={28} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
        </View>

        {/* Secondary Controls */}
        <View className="flex-row items-center justify-around px-12 mt-8">
          {/* Shuffle */}
          <TouchableOpacity 
            onPress={() => setIsShuffle(!isShuffle)}
            className="w-10 h-10 items-center justify-center"
            style={{ 
              backgroundColor: isShuffle ? '#FFF7ED' : 'transparent',
              borderRadius: 20
            }}
          >
            <IconSymbol 
              name="shuffle" 
              size={24} 
              color={isShuffle ? '#FF9500' : (colorScheme === 'dark' ? '#9CA3AF' : '#6B7280')} 
            />
          </TouchableOpacity>

          {/* Repeat */}
          <TouchableOpacity 
            onPress={() => setIsRepeat(!isRepeat)}
            className="w-10 h-10 items-center justify-center"
            style={{ 
              backgroundColor: isRepeat ? '#FFF7ED' : 'transparent',
              borderRadius: 20
            }}
          >
            <IconSymbol 
              name={isRepeat ? "repeat.1" : "repeat"} 
              size={24} 
              color={isRepeat ? '#FF9500' : (colorScheme === 'dark' ? '#9CA3AF' : '#6B7280')} 
            />
          </TouchableOpacity>

          {/* Cast */}
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <IconSymbol 
              name="airplayaudio" 
              size={24} 
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>

          {/* More */}
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <IconSymbol 
              name="ellipsis" 
              size={24} 
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>
        </View>

        {/* Lyrics Toggle */}
        <TouchableOpacity 
          className="items-center mt-8"
          onPress={() => setShowLyrics(true)}
        >
          <IconSymbol 
            name="text.quote" 
            size={20} 
            color={colorScheme === 'dark' ? 'white' : 'black'} 
          />
          <Text className={`text-base font-semibold mt-1 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
            Lyrics
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Lyrics Modal */}
      <LyricsModal
        visible={showLyrics}
        onClose={() => setShowLyrics(false)}
        songName={currentSong.name}
        artistName={artistName}
        lyrics={undefined} // TODO: Add lyrics API integration
      />
    </SafeAreaView>
  );
}
