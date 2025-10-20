import { Stack } from 'expo-router';
import { PlantsProvider } from '@/context/PlantsContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PlantsProvider>
        <Stack screenOptions={{ headerTitle: 'I love my plants' }}>
          <Stack.Screen name="index" options={{ title: 'Mes plantes' }} />
          <Stack.Screen name="add" options={{ title: 'Ajouter' }} />
          <Stack.Screen name="plants/[id]" options={{ title: 'Détail' }} />
        </Stack>
      </PlantsProvider>
    </GestureHandlerRootView>
  );
}