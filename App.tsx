import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { setAudioModeAsync } from 'expo-audio';

cssInterop(Image, { className: "style" });

import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootNavigator } from '@/navigation/root-navigator';
import { AudioPlayerProvider } from '@/components/audio-player-provider';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Initialize audio session for background playback
    const initAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: 'doNotMix', // Stop other apps' audio
        });
        console.log('Audio session initialized - will stop other apps audio');
      } catch (error) {
        console.error('Error initializing audio session:', error);
      }
    };

    initAudio();
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <AudioPlayerProvider>
        <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootNavigator />
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </NavigationContainer>
      </AudioPlayerProvider>
    </SafeAreaProvider>
  );
}
