import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface SongOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    song: {
        image: string;
        title: string;
        artist: string;
        duration: string;
    } | null;
}

export function SongOptionsModal({ visible, onClose, song }: SongOptionsModalProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    if (!song) return null;

    const actions = [
        { icon: 'play.circle', label: 'Play' },
        { icon: 'arrow.right.circle', label: 'Play Next' },
        { icon: 'text.badge.plus', label: 'Add to Playing Queue' },
        { icon: 'plus.circle', label: 'Add to Playlist' },
        { icon: 'square.and.arrow.up', label: 'Share' },
        { icon: 'opticaldisc', label: 'Go to Album' },
        { icon: 'person', label: 'Go to Artist' },
        { icon: 'info.circle', label: 'Details' },
        { icon: 'trash', label: 'Delete from Device' },
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
                                    source={{ uri: song.image }}
                                    className="w-16 h-16 rounded-xl mr-4"
                                    contentFit="cover"
                                />
                                <View className="flex-1">
                                    <Text className={`text-xl font-bold mb-1 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`} numberOfLines={1}>
                                        {song.title}
                                    </Text>
                                    <Text className="text-gray-500 font-medium" numberOfLines={1}>
                                        {song.artist}  |  {song.duration}
                                    </Text>
                                </View>
                            </View>

                            {/* Divider */}
                            <View className="h-[1px] bg-gray-200 dark:bg-gray-800 mb-2" />

                            {/* Actions */}
                            <ScrollView showsVerticalScrollIndicator={false} className="max-h-[400px]">
                                {actions.map((action, index) => (
                                    <TouchableOpacity key={index} className="flex-row items-center py-4 space-x-4">
                                        <IconSymbol name={action.icon as any} size={24} color={themeColors.text} />
                                        <Text className={`text-lg font-medium ml-4 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                            {action.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
