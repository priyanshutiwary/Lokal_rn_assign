import { create } from 'zustand';
import { Song, Artist, Album, searchSongs, searchAlbums, searchArtists } from '../services/api';

interface MusicState {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSongs: (query: string) => Promise<void>;
  fetchAlbums: (query: string) => Promise<void>;
  fetchArtists: (query: string) => Promise<void>;
  clearError: () => void;
}

export const useMusicStore = create<MusicState>((set) => ({
  songs: [],
  albums: [],
  artists: [],
  isLoading: false,
  error: null,

  fetchSongs: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const songs = await searchSongs(query, 100);
      set({ songs, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch songs', isLoading: false });
    }
  },

  fetchAlbums: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const albums = await searchAlbums(query, 100);
      set({ albums, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch albums', isLoading: false });
    }
  },

  fetchArtists: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const artists = await searchArtists(query, 100);
      set({ artists, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch artists', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
