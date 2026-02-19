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
import { Audio } from 'expo-av';

cssInterop(Image, { className: "style" });

import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootNavigator } from '@/navigation/root-navigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Initialize audio session for background playback
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: false, // Don't duck, stop other audio
          interruptionModeIOS: 1, // DoNotMix - stop other audio
          interruptionModeAndroid: 2, // DoNotMix - stop other audio
        });
        console.log('Audio session initialized for background playback');
      } catch (error) {
        console.error('Error initializing audio session:', error);
      }
    };

    initAudio();
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigator />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
