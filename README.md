# Mume

React Native app built with Expo, React Navigation v6+, Zustand, and MMKV.

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation v6+ (Native Stack + Bottom Tabs)
- Zustand (State Management)
- MMKV (Fast Storage)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web

## Project Structure

```
mume/
├── src/
│   ├── navigation/      # Navigation setup
│   ├── screens/         # Screen components
│   ├── store/          # Zustand stores
│   └── utils/          # Utilities (storage, etc.)
├── components/         # Reusable components
├── constants/          # Theme and constants
├── hooks/             # Custom hooks
├── assets/            # Images and static files
└── App.tsx            # Root component
```

## State Management

Using Zustand for state management. Example stores:
- `useExampleStore` - Simple counter example
- `usePersistedStore` - Persisted state with MMKV

## Storage

MMKV is configured for fast, synchronous storage. See `src/utils/storage.ts` for utilities.

## Navigation

React Navigation v6+ with:
- Native Stack Navigator (root)
- Bottom Tabs Navigator (main tabs)

Navigation types are defined in `src/navigation/types.ts`.
