import React, { useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { usePlayerStore } from '@/store/player-store';

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const setPlayer = usePlayerStore(state => state.setPlayer);
  const updatePlaybackStatus = usePlayerStore(state => state.updatePlaybackStatus);

  
  // Create the audio player instance
  const player = useAudioPlayer(null, {
    updateInterval: 1000, // Update every second
  });

  // Get real-time status updates
  const status = useAudioPlayerStatus(player);

  // Set up the player in the store and configure audio mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Configure audio mode on initialization
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: 'doNotMix', // Stop other apps' audio
        });
        
        setPlayer(player);
      } catch (error) {
        console.error('Error setting up audio:', error);
        setPlayer(player);
      }
    };

    setupAudio();
    
    return () => {
      player.remove();
      setPlayer(null);
    };
  }, [player, setPlayer]);

  // Monitor playback status and update store
  useEffect(() => {
    if (status) {
      updatePlaybackStatus(
        status.currentTime,
        status.duration,
        status.playing
      );
    }
  }, [status, updatePlaybackStatus]);

  return <>{children}</>;
}
