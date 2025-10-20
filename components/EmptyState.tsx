import { View, Text } from 'react-native';

export default function EmptyState({ message }: { message: string }) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, opacity: 0.6 }}>{message}</Text>
    </View>
  );
}