import { create } from 'zustand';
import { 
  useAudioPlayer, 
  AudioPlayer,
  setAudioModeAsync,
} from 'expo-audio';
import { Song, getDownloadUrl } from '../services/api';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  queue: Song[];
  currentIndex: number;
  player: AudioPlayer | null;
  isLoading: boolean;
  isTransitioning: boolean;
  
  // Actions
  setPlayer: (player: AudioPlayer | null) => void;
  playSong: (song: Song, queue?: Song[]) => Promise<void>;
  playQueue: (songs: Song[], shuffle?: boolean) => Promise<void>;
  togglePlayPause: () => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  seekTo: (time: number) => void;
  setQueue: (songs: Song[], startIndex?: number) => void;
  clearPlayer: () => void;
  updatePlaybackStatus: (currentTime: number, duration: number, isPlaying: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  player: null,
  isLoading: false,
  isTransitioning: false,

  setPlayer: (player: AudioPlayer | null) => {
    set({ player });
  },

  playSong: async (song: Song, queue?: Song[]) => {
    const { player, currentSong: prevSong, isTransitioning } = get();
    
    // Prevent concurrent play operations
    if (isTransitioning) {
      console.log('Already transitioning, ignoring play request');
      return;
    }
    
    try {
      if (!player) {
        console.error('No player instance available');
        return;
      }

      // If it's the same song, just toggle play/pause
      if (prevSong?.id === song.id) {
        console.log('Same song, toggling play state');
        if (player.playing) {
          player.pause();
          set({ isPlaying: false });
        } else {
          player.play();
          set({ isPlaying: true });
        }
        return;
      }

      set({ isLoading: true, isTransitioning: true });
      
      // Stop current playback
      if (player.playing) {
        player.pause();
      }

      // Configure audio mode for exclusive playback (stops other apps)
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix', // This stops other apps' audio
      });

      // Get streaming URL
      const streamUrl = getDownloadUrl(song.downloadUrl, '160kbps');
      
      if (!streamUrl) {
        console.error('No streaming URL available for song:', song.name);
        set({ isLoading: false, isTransitioning: false });
        return;
      }

      console.log('Loading new song:', song.name);

      // Replace the audio source
      player.replace({ uri: streamUrl });
      
      // Play the new song
      player.play();

      const newQueue = queue || [song];
      const index = queue ? queue.findIndex(s => s.id === song.id) : 0;

      set({
        currentSong: song,
        isPlaying: true,
        currentTime: 0,
        duration: song.duration,
        queue: newQueue,
        currentIndex: index >= 0 ? index : 0,
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
    const { player, isPlaying } = get();
    
    if (!player) {
      console.log('No player loaded');
      return;
    }

    try {
      // Ensure audio mode is maintained
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix', // Keep other apps' audio stopped
      });

      if (isPlaying) {
        player.pause();
        set({ isPlaying: false });
      } else {
        player.play();
        set({ isPlaying: true });
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  },

  playNext: async () => {
    const { queue, currentIndex, isTransitioning } = get();
    
    if (isTransitioning) {
      console.log('Already transitioning, ignoring next request');
      return;
    }
    
    if (queue.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % queue.length;
    const nextSong = queue[nextIndex];
    
    await get().playSong(nextSong, queue);
  },

  playPrevious: async () => {
    const { queue, currentIndex, isTransitioning } = get();
    
    if (isTransitioning) {
      console.log('Already transitioning, ignoring previous request');
      return;
    }
    
    if (queue.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    const prevSong = queue[prevIndex];
    
    await get().playSong(prevSong, queue);
  },

  seekTo: async (time: number) => {
    const { player, isPlaying } = get();
    
    if (!player) {
      console.log('No player loaded');
      return;
    }

    try {
      // Ensure audio mode is maintained during seek
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix', // Keep other apps' audio stopped
      });

      // Perform the seek
      player.seekTo(time);
      set({ currentTime: time });

      // If we were playing, ensure we continue playing after seek
      if (isPlaying && !player.playing) {
        player.play();
      }
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

  clearPlayer: () => {
    const { player } = get();
    
    if (player) {
      if (player.playing) {
        player.pause();
      }
      player.remove();
    }

    set({
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      queue: [],
      currentIndex: 0,
      player: null,
      isLoading: false,
      isTransitioning: false,
    });
  },

  updatePlaybackStatus: (currentTime: number, duration: number, isPlaying: boolean) => {
    const state = get();
    
    set({
      isPlaying,
      currentTime: Math.floor(currentTime),
      duration: Math.floor(duration),
    });

    // Auto-play next song when current finishes
    if (currentTime >= duration && duration > 0 && state.isPlaying) {
      get().playNext();
    }
  },
}));
