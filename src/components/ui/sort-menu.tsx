import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

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
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <TouchableWithoutFeedback>
                        <View 
                            className="w-[250px] rounded-xl py-2 shadow-lg"
                            style={{ backgroundColor: themeColors.background }}
                        >
                            {SORT_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    className="flex-row justify-between items-center py-3 px-4"
                                    onPress={() => {
                                        onSelectOption(option);
                                        onClose();
                                    }}
                                >
                                    <Text className={`text-base font-medium ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                        {option}
                                    </Text>

                                    {/* Radio Button */}
                                    <View className="w-5 h-5 rounded-full border-2 items-center justify-center" style={{ borderColor: themeColors.icon }}>
                                        {selectedOption === option && (
                                            <View className="w-2.5 h-2.5 rounded-full bg-[#FF9500]" />
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
