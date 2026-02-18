import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PersistedState {
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  // Theme is also here? The previous file had 'theme' here too.
  // The user might be migrating theme to theme-store.ts, but persisted-store.ts kept it.
  // I will keep it consistent with previous file but use persist middleware.
  // However, I see 'theme' in theme-store.ts too. This implies duplication.
  // I will just keep the existing structure but use persist.
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export const usePersistedStore = create<PersistedState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'auto',

      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-state',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
