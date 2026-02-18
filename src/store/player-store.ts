import { create } from 'zustand';
import { Audio } from 'expo-av';
import { Song, getDownloadUrl } from '../services/api';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  queue: Song[];
  currentIndex: number;
  sound: Audio.Sound | null;
  isLoading: boolean;
  isTransitioning: boolean;
  
  // Actions
  playSong: (song: Song, queue?: Song[]) => Promise<void>;
  playQueue: (songs: Song[], shuffle?: boolean) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  seekTo: (time: number) => Promise<void>;
  setQueue: (songs: Song[], startIndex?: number) => void;
  clearPlayer: () => Promise<void>;
  updatePlaybackStatus: (status: any) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  sound: null,
  isLoading: false,
  isTransitioning: false,

  playSong: async (song: Song, queue?: Song[]) => {
    const { sound: currentSound, currentSong: prevSong, isTransitioning } = get();
    
    // Prevent concurrent play operations
    if (isTransitioning) {
      console.log('Already transitioning, ignoring play request');
      return;
    }
    
    try {
      // If it's the same song and sound exists, just toggle play/pause
      if (prevSong?.id === song.id && currentSound) {
        console.log('Same song, toggling play state');
        const status = await currentSound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await currentSound.pauseAsync();
            set({ isPlaying: false, isLoading: false });
          } else {
            await currentSound.playAsync();
            set({ isPlaying: true, isLoading: false });
          }
        }
        return;
      }

      set({ isLoading: true, isTransitioning: true });
      
      // CRITICAL: Unload and stop previous sound completely
      if (currentSound) {
        console.log('Stopping and unloading previous sound');
        try {
          const status = await currentSound.getStatusAsync();
          if (status.isLoaded) {
            await currentSound.stopAsync();
          }
          await currentSound.unloadAsync();
        } catch (error) {
          console.error('Error unloading previous sound:', error);
        }
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Get streaming URL
      const streamUrl = getDownloadUrl(song.downloadUrl, '160kbps');
      
      if (!streamUrl) {
        console.error('No streaming URL available for song:', song.name);
        set({ isLoading: false, isTransitioning: false });
        return;
      }

      console.log('Loading new song:', song.name, 'URL:', streamUrl);

      // Create and load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
        (status) => get().updatePlaybackStatus(status)
      );

      const newQueue = queue || [song];
      const index = queue ? queue.findIndex(s => s.id === song.id) : 0;

      set({
        currentSong: song,
        isPlaying: true,
        currentTime: 0,
        duration: song.duration,
        queue: newQueue,
        currentIndex: index >= 0 ? index : 0,
        sound: newSound,
        isLoading: false,
        isTransitioning: false,
      });
    } catch (error) {
      console.error('Error playing song:', error);
      set({ isLoading: false, isPlaying: false, isTransitioning: false });
    }
  },

  playQueue: async (songs: Song[], shuffle: boolean = false) => {
    if (songs.length === 0) return;
    
    let queueToPlay = [...songs];
    
    // Shuffle if requested
    if (shuffle) {
      queueToPlay = queueToPlay.sort(() => Math.random() - 0.5);
    }
    
    const firstSong = queueToPlay[0];
    await get().playSong(firstSong, queueToPlay);
  },

  togglePlayPause: async () => {
    const { sound, isPlaying } = get();
    
    if (!sound) {
      console.log('No sound loaded');
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      
      if (!status.isLoaded) {
        console.log('Sound not loaded yet');
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
        set({ isPlaying: false });
      } else {
        await sound.playAsync();
        set({ isPlaying: true });
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  },

  playNext: async () => {
    const { queue, currentIndex, sound: currentSound, isTransitioning } = get();
    
    if (isTransitioning) {
      console.log('Already transitioning, ignoring next request');
      return;
    }
    
    if (queue.length === 0) return;
    
    set({ isTransitioning: true });
    
    // Stop current sound before playing next
    if (currentSound) {
      try {
        const status = await currentSound.getStatusAsync();
        if (status.isLoaded) {
          await currentSound.stopAsync();
        }
        await currentSound.unloadAsync();
      } catch (error) {
        console.error('Error stopping current sound:', error);
      }
    }
    
    const nextIndex = (currentIndex + 1) % queue.length;
    const nextSong = queue[nextIndex];
    
    set({ isTransitioning: false });
    await get().playSong(nextSong, queue);
  },

  playPrevious: async () => {
    const { queue, currentIndex, sound: currentSound, isTransitioning } = get();
    
    if (isTransitioning) {
      console.log('Already transitioning, ignoring previous request');
      return;
    }
    
    if (queue.length === 0) return;
    
    set({ isTransitioning: true });
    
    // Stop current sound before playing previous
    if (currentSound) {
      try {
        const status = await currentSound.getStatusAsync();
        if (status.isLoaded) {
          await currentSound.stopAsync();
        }
        await currentSound.unloadAsync();
      } catch (error) {
        console.error('Error stopping current sound:', error);
      }
    }
    
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    const prevSong = queue[prevIndex];
    
    set({ isTransitioning: false });
    await get().playSong(prevSong, queue);
  },

  seekTo: async (time: number) => {
    const { sound } = get();
    
    if (!sound) {
      console.log('No sound loaded');
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      
      if (!status.isLoaded) {
        console.log('Sound not loaded yet');
        return;
      }

      await sound.setPositionAsync(time * 1000); // Convert to milliseconds
      set({ currentTime: time });
    } catch (error) {
      console.error('Error seeking:', error);
    }
  },

  setQueue: (songs: Song[], startIndex: number = 0) => {
    set({
      queue: songs,
      currentIndex: startIndex,
      currentSong: songs[startIndex] || null,
      duration: songs[startIndex]?.duration || 0,
    });
  },

  clearPlayer: async () => {
    const { sound } = get();
    
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
        }
        await sound.unloadAsync();
      } catch (error) {
        console.error('Error unloading sound:', error);
      }
    }

    set({
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      queue: [],
      currentIndex: 0,
      sound: null,
      isLoading: false,
      isTransitioning: false,
    });
  },

  updatePlaybackStatus: (status: any) => {
    if (!status.isLoaded) return;

    set({
      isPlaying: status.isPlaying,
      currentTime: Math.floor(status.positionMillis / 1000),
      duration: Math.floor(status.durationMillis / 1000),
    });

    // Auto-play next song when current finishes
    if (status.didJustFinish) {
      get().playNext();
    }
  },
}));
