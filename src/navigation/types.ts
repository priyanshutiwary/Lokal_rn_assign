import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  Modal: undefined;
  ArtistDetail: {
    artist: {
      id: string;
      name: string;
      image: string;
      albumCount: number;
      songCount: number;
    };
  };
  AlbumDetail: {
    album: {
      id: string;
      title: string;
      artist: string;
      year: string;
      songCount: number;
      image: string;
    };
  };
  Search: undefined;
  Player: undefined;
};

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Playlists: undefined;
  Settings: undefined;
};
