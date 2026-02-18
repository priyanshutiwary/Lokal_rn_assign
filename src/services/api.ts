const BASE_URL = 'https://saavn.sumit.co/api';

export interface Song {
  id: string;
  name: string;
  duration: number;
  language: string;
  album: {
    id: string;
    name: string;
    url?: string;
  };
  artists: {
    primary: Array<{
      id: string;
      name: string;
    }>;
  };
  image: Array<{
    quality: string;
    url?: string;
    link?: string;
  }>;
  downloadUrl: Array<{
    quality: string;
    url?: string;
    link?: string;
  }>;
  year?: string;
  playCount?: string;
  primaryArtists?: string;
}

export interface Artist {
  id: string;
  name: string;
  image: Array<{
    quality: string;
    url?: string;
    link?: string;
  }>;
  followerCount?: string;
  fanCount?: string;
  isVerified?: boolean;
  dominantLanguage?: string;
  dominantType?: string;
  topSongs?: Song[];
  topAlbums?: Album[];
}

export interface Album {
  id: string;
  name: string;
  year?: string;
  releaseDate?: string;
  songCount?: number;
  url?: string;
  primaryArtists?: string;
  primaryArtistsId?: string;
  image: Array<{
    quality: string;
    url?: string;
    link?: string;
  }>;
  songs?: Song[];
  title?: string;
  artist?: string;
}

// Helper to get image URL
export const getImageUrl = (images: Array<{ quality: string; url?: string; link?: string }>, quality: '50x50' | '150x150' | '500x500' = '500x500'): string => {
  if (!images || images.length === 0) {
    // Return a placeholder image URL
    return 'https://via.placeholder.com/500x500/FF9500/FFFFFF?text=No+Image';
  }
  
  const image = images.find(img => img.quality === quality) || images[images.length - 1];
  const imageUrl = image?.url || image?.link || '';
  
  // If still no URL, return placeholder
  if (!imageUrl) {
    return 'https://via.placeholder.com/500x500/FF9500/FFFFFF?text=No+Image';
  }
  
  return imageUrl;
};

// Helper to get download/stream URL
export const getDownloadUrl = (downloadUrls: Array<{ quality: string; url?: string; link?: string }>, quality: '12kbps' | '48kbps' | '96kbps' | '160kbps' | '320kbps' = '160kbps'): string => {
  if (!downloadUrls || downloadUrls.length === 0) {
    return '';
  }
  
  // Try to find the requested quality
  const url = downloadUrls.find(dl => dl.quality === quality);
  if (url?.url || url?.link) {
    return url.url || url.link || '';
  }
  
  // Fallback to highest quality available
  const highestQuality = downloadUrls[downloadUrls.length - 1];
  return highestQuality?.url || highestQuality?.link || '';
};

// Search APIs
export const searchSongs = async (query: string, limit: number = 100): Promise<Song[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await response.json();
    return data.data?.results || [];
  } catch (error) {
    console.error('Error searching songs:', error);
    return [];
  }
};

export const searchAlbums = async (query: string, limit: number = 100): Promise<Album[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search/albums?query=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await response.json();
    return data.data?.results || [];
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
};

export const searchArtists = async (query: string, limit: number = 100): Promise<Artist[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search/artists?query=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await response.json();
    return data.data?.results || [];
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
};

// Songs APIs
export const getSongById = async (id: string): Promise<Song | null> => {
  try {
    const response = await fetch(`${BASE_URL}/songs/${id}`);
    const data = await response.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching song:', error);
    return null;
  }
};

export const getSongSuggestions = async (id: string): Promise<Song[]> => {
  try {
    const response = await fetch(`${BASE_URL}/songs/${id}/suggestions`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching song suggestions:', error);
    return [];
  }
};

// Artists APIs
export const getArtistById = async (id: string): Promise<Artist | null> => {
  try {
    const response = await fetch(`${BASE_URL}/artists/${id}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching artist:', error);
    return null;
  }
};

export const getArtistSongs = async (id: string): Promise<Song[]> => {
  try {
    const response = await fetch(`${BASE_URL}/artists/${id}/songs`);
    const data = await response.json();
    return data.data?.songs || [];
  } catch (error) {
    console.error('Error fetching artist songs:', error);
    return [];
  }
};

export const getArtistAlbums = async (id: string): Promise<Album[]> => {
  try {
    const response = await fetch(`${BASE_URL}/artists/${id}/albums`);
    const data = await response.json();
    return data.data?.albums || [];
  } catch (error) {
    console.error('Error fetching artist albums:', error);
    return [];
  }
};

// Albums APIs
export const getAlbumById = async (id: string): Promise<Album | null> => {
  try {
    const url = `${BASE_URL}/albums/${id}`;
    console.log('Fetching album from:', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('Album API response:', JSON.stringify(data, null, 2));
    return data.data || data || null;
  } catch (error) {
    console.error('Error fetching album:', error);
    return null;
  }
};
