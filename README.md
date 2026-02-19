# Mume - Music Player

A music streaming app built with React Native (Expo) using the JioSaavn API.

## Demo

Watch the demo: [YouTube Demo](https://youtube.com/shorts/Tn8d3ZcHaFs?feature=share)

## Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

```bash
cd mume
npm install
npm start
```

Run on device:
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go

### Build APK

Option 1 - EAS Build (Cloud):
```bash
eas build --platform android --profile preview
```

Option 2 - Local Build (Manual):
```bash
# Generate native Android project
npx expo prebuild

# Navigate to Android folder and build
cd android
./gradlew assembleDebug
./gradlew installDebug

# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

## Architecture

### State Management - Zustand

Chose Zustand over Redux Toolkit for:
- Simpler API with less boilerplate
- Built-in persistence middleware
- Smaller bundle size
- Hooks-based, easy to use

Two stores:
- `music-store.ts` - Search results, pagination, caching
- `player-store.ts` - Playback state, queue, controls

### Audio Playback - Expo Audio

Key features:
- Background playback (`shouldPlayInBackground: true`)
- Silent mode support (`playsInSilentMode: true`)
- Exclusive audio mode (`interruptionMode: 'doNotMix'`)
- Real-time status updates via `useAudioPlayerStatus`
- Auto-advance to next song

`AudioPlayerProvider` wraps the app and manages player lifecycle through Zustand.

### Navigation - React Navigation v7

- Stack navigator for screens
- Tab navigator for Home (Songs/Albums/Artists)
- Type-safe with TypeScript
- Mini player persists via absolute positioning

### Persistence - AsyncStorage

- Caches search results for offline use
- Stores fetch timestamps
- Handles offline mode gracefully
- Hydration tracking

## Trade-offs

### Prioritized
- Smooth playback and background mode
- Perfect sync between mini and full player
- Offline support with cached data
- Type safety throughout
- Clean, maintainable architecture

### Not Implemented
- Download for offline (needs file system management)
- Repeat modes 
- User playlists

### Technical Debt
- No unit tests
- Limited error boundaries
- No analytics/crash reporting
- Could improve image caching
