import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    title: string;
    onSeeAll?: () => void;
}

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <View className="flex-row justify-between items-center mb-3 mt-6 px-5">
            <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                {title}
            </Text>
            {onSeeAll && (
                <TouchableOpacity onPress={onSeeAll}>
                    <Text className="text-base text-[#FF9500] font-semibold">See All</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
