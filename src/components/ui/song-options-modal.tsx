import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View, Share, Alert } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { usePlayerStore } from '@/store/player-store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Song } from '../../services/api';

interface SongOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    song: Song | null;
    allSongs?: Song[];
}

export function SongOptionsModal({ visible, onClose, song, allSongs = [] }: SongOptionsModalProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { playSong, queue, currentIndex, setQueue } = usePlayerStore();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    if (!song) return null;

    const artistName = song.artists?.primary?.[0]?.name || song.primaryArtists || 'Unknown Artist';
    const artistId = song.artists?.primary?.[0]?.id || '';
    const albumName = song.album?.name || 'Unknown Album';
    const albumId = song.album?.id || '';
    const duration = `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')} mins`;

    const handlePlay = () => {
        playSong(song, allSongs.length > 0 ? allSongs : [song]);
        onClose();
    };

    const handlePlayNext = () => {
        const newQueue = [...queue];
        newQueue.splice(currentIndex + 1, 0, song);
        setQueue(newQueue, currentIndex);
        Alert.alert('Added to Queue', `${song.name} will play next`);
        onClose();
    };

    const handleAddToQueue = () => {
        const newQueue = [...queue, song];
        setQueue(newQueue, currentIndex);
        Alert.alert('Added to Queue', `${song.name} added to playing queue`);
        onClose();
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out "${song.name}" by ${artistName}`,
                title: song.name,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
        onClose();
    };

    const handleGoToAlbum = () => {
        if (albumId) {
            navigation.navigate('AlbumDetail', {
                album: {
                    id: albumId,
                    title: albumName,
                    artist: artistName,
                    year: song.year || '',
                    songCount: 0,
                    image: song.image?.[0]?.url || song.image?.[0]?.link || ''
                }
            });
        }
        onClose();
    };

    const handleGoToArtist = () => {
        if (artistId) {
            navigation.navigate('ArtistDetail', {
                artist: {
                    id: artistId,
                    name: artistName,
                    image: song.image?.[0]?.url || song.image?.[0]?.link || '',
                    albumCount: 0,
                    songCount: 0
                }
            });
        }
        onClose();
    };

    const handleDetails = () => {
        Alert.alert(
            song.name,
            `Artist: ${artistName}\nAlbum: ${albumName}\nDuration: ${duration}\nLanguage: ${song.language || 'Unknown'}\nYear: ${song.year || 'Unknown'}`,
            [{ text: 'OK' }]
        );
        onClose();
    };

    const actions = [
        { icon: 'play.circle', label: 'Play', onPress: handlePlay },
        { icon: 'arrow.right.circle', label: 'Play Next', onPress: handlePlayNext },
        { icon: 'text.badge.plus', label: 'Add to Playing Queue', onPress: handleAddToQueue },
        { icon: 'plus.circle', label: 'Add to Playlist', onPress: () => { Alert.alert('Coming Soon', 'Playlist feature coming soon!'); onClose(); } },
        { icon: 'square.and.arrow.up', label: 'Share', onPress: handleShare },
        { icon: 'music.note.list', label: 'Go to Album', onPress: handleGoToAlbum },
        { icon: 'music.note', label: 'Go to Artist', onPress: handleGoToArtist },
        { icon: 'ellipsis', label: 'Details', onPress: handleDetails },
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
                                    source={{ uri: song.image?.[0]?.url || song.image?.[0]?.link || '' }}
                                    className="w-16 h-16 rounded-xl mr-4"
                                    contentFit="cover"
                                />
                                <View className="flex-1">
                                    <Text className={`text-xl font-bold mb-1 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`} numberOfLines={1}>
                                        {song.name}
                                    </Text>
                                    <Text className="text-gray-500 font-medium" numberOfLines={1}>
                                        {artistName}  |  {duration}
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
