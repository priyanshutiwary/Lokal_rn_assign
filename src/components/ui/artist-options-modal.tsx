import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View, Share, Alert } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { usePlayerStore } from '@/store/player-store';
import { useMusicStore } from '@/store/music-store';

interface Artist {
    id: string;
    name: string;
    image: string;
    albumCount: number;
    songCount: number;
}

interface ArtistOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    artist: Artist | null;
}

export function ArtistOptionsModal({ visible, onClose, artist }: ArtistOptionsModalProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { playSong, queue, currentIndex, setQueue } = usePlayerStore();
    const { songs } = useMusicStore();

    if (!artist) return null;

    // Get all songs by this artist
    const artistSongs = songs.filter(song => 
        song.artists?.primary?.some(a => a.id === artist.id) || 
        song.primaryArtists?.toLowerCase().includes(artist.name.toLowerCase())
    );

    const handlePlay = () => {
        if (artistSongs.length > 0) {
            playSong(artistSongs[0], artistSongs);
            onClose();
        } else {
            Alert.alert('No Songs', 'No songs available for this artist');
            onClose();
        }
    };

    const handlePlayNext = () => {
        if (artistSongs.length > 0) {
            const newQueue = [...queue];
            newQueue.splice(currentIndex + 1, 0, ...artistSongs);
            setQueue(newQueue, currentIndex);
            Alert.alert('Added to Queue', `${artistSongs.length} songs will play next`);
        } else {
            Alert.alert('No Songs', 'No songs available for this artist');
        }
        onClose();
    };

    const handleAddToQueue = () => {
        if (artistSongs.length > 0) {
            const newQueue = [...queue, ...artistSongs];
            setQueue(newQueue, currentIndex);
            Alert.alert('Added to Queue', `${artistSongs.length} songs added to playing queue`);
        } else {
            Alert.alert('No Songs', 'No songs available for this artist');
        }
        onClose();
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${artist.name}`,
                title: artist.name,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
        onClose();
    };

    const actions = [
        { icon: 'play.circle', label: 'Play', onPress: handlePlay },
        { icon: 'arrow.right.circle', label: 'Play Next', onPress: handlePlayNext },
        { icon: 'text.badge.plus', label: 'Add to Playing Queue', onPress: handleAddToQueue },
        { icon: 'plus.circle', label: 'Add to Playlist', onPress: () => { Alert.alert('Coming Soon', 'Playlist feature coming soon!'); onClose(); } },
        { icon: 'square.and.arrow.up', label: 'Share', onPress: handleShare },
    ];

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/50 justify-end">
                    <TouchableWithoutFeedback>
                        <View className={`rounded-t-3xl p-5 pb-10 ${colorScheme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-white'}`}>
                            {/* Handle */}
                            <View className="items-center mb-6">
                                <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                            </View>

                            {/* Header */}
                            <View className="flex-row items-center mb-8">
                                <Image
                                    source={{ uri: artist.image }}
                                    className="w-16 h-16 rounded-full mr-4"
                                    contentFit="cover"
                                />
                                <View>
                                    <Text className={`text-xl font-bold mb-1 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                        {artist.name}
                                    </Text>
                                    <Text className="text-gray-500 font-medium">
                                        {artist.albumCount} {artist.albumCount === 1 ? 'Album' : 'Albums'}  |  {artist.songCount} {artist.songCount === 1 ? 'Song' : 'Songs'}
                                    </Text>
                                </View>
                            </View>

                            {/* Divider */}
                            <View className="h-[1px] bg-gray-200 dark:bg-gray-800 mb-2" />

                            {/* Actions */}
                            <View>
                                {actions.map((action, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        className="flex-row items-center py-4 space-x-4"
                                        onPress={action.onPress}
                                    >
                                        <IconSymbol name={action.icon as any} size={26} color={themeColors.text} />
                                        <Text className={`text-lg font-medium ml-4 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                            {action.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
