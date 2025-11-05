import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePlants } from '@/context/PlantsContext';
import { Room, Plant } from '@/types';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import PlantCard from '@/components/PlantCard';
import EmptyState from '@/components/EmptyState';

export default function RoomDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { rooms, plants } = usePlants();
  
  const room = rooms.find(r => r.id === id);
  if (!room) return <EmptyState message="Room not found" />;
  
  const roomPlants = plants.filter(p => room.plantIds.includes(p.id));

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {room.name}
      </ThemedText>
      
      {roomPlants.length === 0 ? (
        <EmptyState 
          message="No plants in this room"
        />
      ) : (
        <View style={{ gap: 12 }}>
          {roomPlants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </View>
      )}
    </ThemedView>
  );
}
