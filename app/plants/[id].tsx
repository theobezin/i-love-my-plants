import { usePlants } from '@/context/PlantsContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

export default function PlantDetail() {
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlant, waterPlant, removePlant, rooms, addPlantToRoom, removePlantFromRoom } = usePlants();
  const plant = id ? getPlant(id) : undefined;

  if (!plant) {
    return <View style={{ padding: 16 }}><Text>Plante introuvable.</Text></View>;
  }

  const last = plant.lastWateredAt ? new Date(plant.lastWateredAt).toLocaleDateString() : 'jamais';
  
  const plantRooms = rooms.filter(room => room.plantIds.includes(plant.id));

  return (
    <View style={{ padding: 16, gap: 12 }}>
      {plant.imageUri && (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: plant.imageUri }}
            style={{ width: '100%', height: 220, borderRadius: 12, marginBottom: 8 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
      <Text style={{ fontSize: 24, fontWeight: '700' }}>{plant.name}</Text>
      {plant.species ? <Text style={{ opacity: 0.7 }}>{plant.species}</Text> : null}
      <Text>Fréquence : tous les {plant.frequencyDays} jours</Text>
      <Text>Dernier arrosage : {last}</Text>

      {/* Rooms section */}
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Pièces</Text>
        {plantRooms.length === 0 ? (
          <Text style={{ opacity: 0.7 }}>Cette plante n'est pas assignée à une pièce</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {plantRooms.map(room => (
              <Pressable
                key={room.id}
                onPress={() => {
                  Alert.alert(
                    'Retirer de la pièce',
                    `Retirer ${plant.name} de ${room.name} ?`,
                    [
                      { text: 'Annuler', style: 'cancel' },
                      { 
                        text: 'Retirer',
                        style: 'destructive',
                        onPress: () => removePlantFromRoom(plant.id, room.id)
                      },
                    ]
                  );
                }}
                style={{
                  backgroundColor: '#e3f2fd',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16
                }}
              >
                <Text style={{ color: '#1565c0' }}>{room.name} ×</Text>
              </Pressable>
            ))}
          </View>
        )}
        
        {/* Add to room button */}
        {rooms.length > plantRooms.length && (
          <Pressable
            onPress={() => {
              const availableRooms = rooms.filter(r => !plantRooms.find(pr => pr.id === r.id));
              Alert.alert(
                'Ajouter à une pièce',
                'Choisir une pièce:',
                [
                  { text: 'Annuler', style: 'cancel' },
                  ...availableRooms.map(room => ({
                    text: room.name,
                    onPress: () => addPlantToRoom(plant.id, room.id)
                  }))
                ]
              );
            }}
            style={{
              marginTop: 8,
              padding: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#1565c0',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#1565c0' }}>Ajouter à une pièce</Text>
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={async () => { await waterPlant(plant.id); }}
        style={{ backgroundColor:'#1565c0', padding:14, borderRadius:10, alignItems:'center', marginTop: 16 }}
      >
        <Text style={{ color:'#fff', fontWeight:'600' }}>Arrosée aujourd'hui</Text>
      </Pressable>

      <Pressable onPress={() => {
        Alert.alert('Supprimer', 'Cette plante sera supprimée.', [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Supprimer', style: 'destructive', onPress: async () => { await removePlant(plant.id); router.replace('/'); } },
        ]);
      }} style={{ padding:12, borderRadius:10, alignItems:'center', borderWidth:1, borderColor:'#c62828' }}>
        <Text style={{ color:'#c62828', fontWeight:'600' }}>Supprimer</Text>
      </Pressable>

      {/* Modal for zoomed image */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ position: 'absolute', top: 40, right: 20, zIndex: 2 }} onPress={() => setModalVisible(false)}>
            <Text style={{ color: '#fff', fontSize: 22 }}>Fermer</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: plant.imageUri }}
            style={{ width: '90%', height: '70%', borderRadius: 16 }}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
}
