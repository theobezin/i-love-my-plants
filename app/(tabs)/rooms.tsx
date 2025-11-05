import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { usePlants } from '@/context/PlantsContext';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function RoomsList() {
  const { rooms, addRoom, removeRoom, plants } = usePlants();

  const promptNewRoom = () => {
    Alert.prompt(
      'Nouvelle pièce',
      'Entrez le nom de la pièce:',
      async (name) => {
        if (name?.trim()) {
          await addRoom(name.trim());
        }
      }
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>Pièces</ThemedText>
          <Pressable
            onPress={promptNewRoom}
            style={{ backgroundColor: '#1565c0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
          >
            <Text style={{ color: '#fff' }}>Ajouter</Text>
          </Pressable>
        </View>

        {rooms.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 32, opacity: 0.7 }}>
            <ThemedText>Aucune pièce. Ajoutez-en une pour commencer!</ThemedText>
          </View>
        ) : (
          rooms.map(room => {
            const roomPlants = plants.filter(p => room.plantIds.includes(p.id));
            return (
              <Link key={room.id} href={`/rooms/${room.id}`} asChild>
                <Pressable
                  style={{
                    backgroundColor: '#fff',
                    padding: 16,
                    borderRadius: 12,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: '600' }}>{room.name}</Text>
                      <Text style={{ opacity: 0.7 }}>
                        {roomPlants.length} plante{roomPlants.length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <Pressable
                      onPress={(e) => {
                        e.preventDefault();
                        Alert.alert(
                          'Supprimer la pièce',
                          `Voulez-vous supprimer "${room.name}" ?`,
                          [
                            { text: 'Annuler', style: 'cancel' },
                            {
                              text: 'Supprimer',
                              style: 'destructive',
                              onPress: () => removeRoom(room.id)
                            }
                          ]
                        );
                      }}
                      style={{ padding: 8 }}
                    >
                      <Text style={{ color: '#c62828' }}>Supprimer</Text>
                    </Pressable>
                  </View>
                </Pressable>
              </Link>
            );
          })
        )}
      </ScrollView>
    </ThemedView>
  );
}