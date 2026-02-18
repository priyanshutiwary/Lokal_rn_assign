import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

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
        { icon: 'arrow.right.circle', label: 'Play Next' },
        { icon: 'text.badge.plus', label: 'Add to Playing Queue' },
        { icon: 'plus.circle', label: 'Add to Playlist' },
        { icon: 'opticaldisc', label: 'Go to Album' },
        { icon: 'person', label: 'Go to Artist' },
        { icon: 'info.circle', label: 'Details' },
        { icon: 'phone', label: 'Set as Ringtone' },
        { icon: 'xmark.circle', label: 'Add to Blacklist' },
        { icon: 'square.and.arrow.up', label: 'Share' },
        { icon: 'trash', label: 'Delete from Device' },
    ];

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Image source={{ uri: song.image }} style={styles.image} contentFit="cover" />
                                <View style={styles.headerInfo}>
                                    <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>{song.title}</Text>
                                    <Text style={[styles.subtitle, { color: themeColors.icon }]} numberOfLines={1}>
                                        {song.artist} | {song.duration}
                                    </Text>
                                </View>
                                <TouchableOpacity>
                                    <IconSymbol name="heart" size={24} color={themeColors.text} />
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.divider, { backgroundColor: themeColors.icon, opacity: 0.2 }]} />

                            {/* Actions List */}
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {actions.map((action, index) => (
                                    <TouchableOpacity key={index} style={styles.actionItem} onPress={onClose}>
                                        <IconSymbol name={action.icon as any} size={24} color={themeColors.text} />
                                        <Text style={[styles.actionLabel, { color: themeColors.text }]}>{action.label}</Text>
                                    </TouchableOpacity>
                                ))}
                                <View style={{ height: 20 }} />
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingHorizontal: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
    divider: {
        height: 1,
        marginBottom: 10,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    actionLabel: {
        fontSize: 16,
        marginLeft: 16,
        fontWeight: '500',
    },
});
