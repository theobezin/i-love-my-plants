import { View, FlatList, Pressable, Text } from 'react-native';
import { Link } from 'expo-router';
import { usePlants } from '@/context/PlantsContext';
import PlantCard from '@/components/PlantCard';
import EmptyState from '@/components/EmptyState';

export default function Home() {
  const { plants } = usePlants();

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {plants.length === 0 ? (
        <EmptyState message="Aucune plante pour l’instant. Ajoute ta première !" />
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => <PlantCard plant={item} />}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}

      <Link href="/add" asChild>
        <Pressable style={{
          position: 'absolute', right: 16, bottom: 16,
          backgroundColor: '#2e7d32', paddingHorizontal: 20, paddingVertical: 14,
          borderRadius: 28, elevation: 3
        }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Ajouter</Text>
        </Pressable>
      </Link>
    </View>
  );
}
