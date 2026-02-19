import React, { useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from './icon-symbol';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50;

interface LyricsModalProps {
  visible: boolean;
  onClose: () => void;
  lyrics?: string;
  songName?: string;
  artistName?: string;
}

export function LyricsModal({ visible, onClose, lyrics, songName, artistName }: LyricsModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD) {
          closeModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity 
          className="flex-1" 
          activeOpacity={1} 
          onPress={closeModal}
        />
        
        <Animated.View
          style={{
            transform: [{ translateY }],
            maxHeight: SCREEN_HEIGHT * 0.85,
          }}
          className={`rounded-t-3xl ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
          {...panResponder.panHandlers}
        >
          {/* Drag Handle */}
          <View className="items-center py-3">
            <View className={`w-12 h-1 rounded-full ${colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </View>

          {/* Header */}
          <View className="flex-row justify-between items-center px-5 pb-4 border-b border-gray-200 dark:border-gray-800">
            <View className="flex-1">
              <Text className={`text-lg font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                Lyrics
              </Text>
              {songName && (
                <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
                  {songName} • {artistName}
                </Text>
              )}
            </View>
            <TouchableOpacity 
              onPress={closeModal}
              className="w-8 h-8 items-center justify-center"
            >
              <IconSymbol name="xmark" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
            </TouchableOpacity>
          </View>

          {/* Lyrics Content */}
          <Animated.ScrollView
            className="flex-1 px-5 py-6"
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            {lyrics ? (
              <Text className={`text-base leading-8 ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {lyrics}
              </Text>
            ) : (
              <View className="items-center justify-center py-20">
                <IconSymbol name="music.note" size={48} color="#FF9500" />
                <Text className={`text-center text-base mt-4 ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Lyrics not available
                </Text>
                <Text className={`text-center text-sm mt-2 px-8 ${colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Lyrics will be displayed here when available from the music provider.
                </Text>
              </View>
            )}
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
