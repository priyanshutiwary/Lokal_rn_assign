import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  const navigation = useNavigation();

  return (
    <ThemedView className="flex-1 items-center justify-center p-5">
      <ThemedText type="title">This is a modal</ThemedText>
      <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 py-4">
        <ThemedText type="link">Go back</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
