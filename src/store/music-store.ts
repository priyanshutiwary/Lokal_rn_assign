import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song, Artist, Album, searchSongs, searchAlbums, searchArtists } from '../services/api';

interface MusicState {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  isLoading: boolean;
  error: string | null;
  currentPage: {
    songs: number;
    albums: number;
    artists: number;
  };
  hasMore: {
    songs: boolean;
    albums: boolean;
    artists: boolean;
  };
  lastFetch: {
    songs: number;
    albums: number;
    artists: number;
  };
  isOffline: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  
  // Actions
  fetchSongs: (query: string, append?: boolean) => Promise<void>;
  fetchAlbums: (query: string, append?: boolean) => Promise<void>;
  fetchArtists: (query: string, append?: boolean) => Promise<void>;
  loadMoreSongs: (query: string) => Promise<void>;
  loadMoreAlbums: (query: string) => Promise<void>;
  loadMoreArtists: (query: string) => Promise<void>;
  clearError: () => void;
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      songs: [],
      albums: [],
      artists: [],
      isLoading: false,
      error: null,
      currentPage: {
        songs: 1,
        albums: 1,
        artists: 1,
      },
      hasMore: {
        songs: true,
        albums: true,
        artists: true,
      },
      lastFetch: {
        songs: 0,
        albums: 0,
        artists: 0,
      },
      isOffline: false,
      _hasHydrated: false,
      
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      fetchSongs: async (query: string, append: boolean = false) => {
        // Wait for hydration before fetching
        if (!get()._hasHydrated) {
          return;
        }

        // Don't fetch if we're already offline and have no data
        const currentState = get();
        if (currentState.isOffline && currentState.songs.length === 0) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const page = append ? get().currentPage.songs : 1;
          const songs = await searchSongs(query, 100, page);
          set({ 
            songs: append ? [...get().songs, ...songs] : songs,
            isLoading: false,
            isOffline: false,
            currentPage: { ...get().currentPage, songs: append ? page : 1 },
            hasMore: { ...get().hasMore, songs: songs.length > 0 },
            lastFetch: { ...get().lastFetch, songs: Date.now() }
          });
        } catch (error) {
          console.error('Failed to fetch songs, using cached data:', error);
          // If we have cached data, keep it and just set offline flag
          const currentSongs = get().songs;
          if (currentSongs.length > 0) {
            set({ 
              error: 'Using offline data',
              isLoading: false,
              isOffline: true
            });
          } else {
            // No cached data available, show error but don't reset other tabs
            set({ 
              error: 'Failed to fetch songs and no cached data available',
              isLoading: false,
              isOffline: true
            });
          }
        }
      },

      fetchAlbums: async (query: string, append: boolean = false) => {
        // Wait for hydration before fetching
        if (!get()._hasHydrated) {
          return;
        }

        // Don't fetch if we're already offline and have no data
        const currentState = get();
        if (currentState.isOffline && currentState.albums.length === 0) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const page = append ? get().currentPage.albums : 1;
          const albums = await searchAlbums(query, 100, page);
          set({ 
            albums: append ? [...get().albums, ...albums] : albums,
            isLoading: false,
            isOffline: false,
            currentPage: { ...get().currentPage, albums: append ? page : 1 },
            hasMore: { ...get().hasMore, albums: albums.length > 0 },
            lastFetch: { ...get().lastFetch, albums: Date.now() }
          });
        } catch (error) {
          console.error('Failed to fetch albums, using cached data:', error);
          // If we have cached data, keep it and just set offline flag
          const currentAlbums = get().albums;
          if (currentAlbums.length > 0) {
            set({ 
              error: 'Using offline data',
              isLoading: false,
              isOffline: true
            });
          } else {
            // No cached data available, show error but don't reset other tabs
            set({ 
              error: 'Failed to fetch albums and no cached data available',
              isLoading: false,
              isOffline: true
            });
          }
        }
      },

      fetchArtists: async (query: string, append: boolean = false) => {
        // Wait for hydration before fetching
        if (!get()._hasHydrated) {
          return;
        }

        // Don't fetch if we're already offline and have no data
        const currentState = get();
        if (currentState.isOffline && currentState.artists.length === 0) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const page = append ? get().currentPage.artists : 1;
          const artists = await searchArtists(query, 100, page);
          set({ 
            artists: append ? [...get().artists, ...artists] : artists,
            isLoading: false,
            isOffline: false,
            currentPage: { ...get().currentPage, artists: append ? page : 1 },
            hasMore: { ...get().hasMore, artists: artists.length > 0 },
            lastFetch: { ...get().lastFetch, artists: Date.now() }
          });
        } catch (error) {
          console.error('Failed to fetch artists, using cached data:', error);
          // If we have cached data, keep it and just set offline flag
          const currentArtists = get().artists;
          if (currentArtists.length > 0) {
            set({ 
              error: 'Using offline data',
              isLoading: false,
              isOffline: true
            });
          } else {
            // No cached data available, show error but don't reset other tabs
            set({ 
              error: 'Failed to fetch artists and no cached data available',
              isLoading: false,
              isOffline: true
            });
          }
        }
      },

      loadMoreSongs: async (query: string) => {
        const { hasMore, isLoading, currentPage, isOffline } = get();
        if (!hasMore.songs || isLoading || isOffline) return;
        
        set({ currentPage: { ...currentPage, songs: currentPage.songs + 1 } });
        await get().fetchSongs(query, true);
      },

      loadMoreAlbums: async (query: string) => {
        const { hasMore, isLoading, currentPage, isOffline } = get();
        if (!hasMore.albums || isLoading || isOffline) return;
        
        set({ currentPage: { ...currentPage, albums: currentPage.albums + 1 } });
        await get().fetchAlbums(query, true);
      },

      loadMoreArtists: async (query: string) => {
        const { hasMore, isLoading, currentPage, isOffline } = get();
        if (!hasMore.artists || isLoading || isOffline) return;
        
        set({ currentPage: { ...currentPage, artists: currentPage.artists + 1 } });
        await get().fetchArtists(query, true);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'music-cache',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the data, not the loading states
      partialize: (state) => ({
        songs: state.songs,
        albums: state.albums,
        artists: state.artists,
        lastFetch: state.lastFetch,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Music store hydration finished');
        state?.setHasHydrated(true);
      },
    }
  )
);
