import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { IconSymbol } from './icon-symbol';

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

    if (!artist) return null;

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
                            <View className="h-[1px] bg-gray-200 dark:bg-gray-800 mb-4" />

                            {/* Actions */}
                            <TouchableOpacity className="flex-row items-center py-4 space-x-4">
                                <IconSymbol name="play.circle" size={24} color={themeColors.text} />
                                <Text className={`text-lg font-medium ml-4 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                    Play
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center py-4 space-x-4">
                                <IconSymbol name="arrow.right.circle" size={24} color={themeColors.text} />
                                <Text className={`text-lg font-medium ml-4 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                    Play Next
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center py-4 space-x-4">
                                <IconSymbol name="text.badge.plus" size={24} color={themeColors.text} />
                                <Text className={`text-lg font-medium ml-4 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                    Add to Playing Queue
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center py-4 space-x-4">
                                <IconSymbol name="plus.circle" size={24} color={themeColors.text} />
                                <Text className={`text-lg font-medium ml-4 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                    Add to Playlist
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center py-4 space-x-4">
                                <IconSymbol name="square.and.arrow.up" size={24} color={themeColors.text} />
                                <Text className={`text-lg font-medium ml-4 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                    Share
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
