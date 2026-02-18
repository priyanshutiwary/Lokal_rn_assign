import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './tab-navigator';
import ModalScreen from '@/screens/modal-screen';
import ArtistDetailScreen from '@/screens/artist-detail-screen';
import AlbumDetailScreen from '@/screens/album-detail-screen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
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
    </Stack.Navigator>
  );
}
