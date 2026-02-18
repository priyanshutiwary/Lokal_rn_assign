import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export type SortOption = 'Ascending' | 'Descending' | 'Artist' | 'Album' | 'Year' | 'Date Added' | 'Date Modified' | 'Composer';

interface SortMenuProps {
    visible: boolean;
    onClose: () => void;
    selectedOption: SortOption;
    onSelectOption: (option: SortOption) => void;
}

const SORT_OPTIONS: SortOption[] = [
    'Ascending',
    'Descending',
    'Artist',
    'Album',
    'Year',
    'Date Added',
    'Date Modified',
    'Composer',
];

export function SortMenu({ visible, onClose, selectedOption, onSelectOption }: SortMenuProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.menuContainer, { backgroundColor: themeColors.background }]}>
                            {SORT_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={styles.optionItem}
                                    onPress={() => {
                                        onSelectOption(option);
                                        onClose();
                                    }}
                                >
                                    <Text style={[styles.optionText, { color: themeColors.text }]}>{option}</Text>

                                    {/* Radio Button */}
                                    <View style={[styles.radioButton, { borderColor: themeColors.icon }]}>
                                        {selectedOption === option && (
                                            <View style={styles.radioButtonSelected} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        width: 250,
        borderRadius: 12,
        paddingVertical: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF9500', // Orange
    },
});
