import { usePlants } from '@/context/PlantsContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

export default function PlantDetail() {
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlant, waterPlant, removePlant } = usePlants();
  const plant = id ? getPlant(id) : undefined;

  if (!plant) {
    return <View style={{ padding: 16 }}><Text>Plante introuvable.</Text></View>;
  }

  const last = plant.lastWateredAt ? new Date(plant.lastWateredAt).toLocaleDateString() : 'jamais';

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

      <Pressable onPress={async () => { await waterPlant(plant.id); }}
        style={{ backgroundColor:'#1565c0', padding:14, borderRadius:10, alignItems:'center' }}>
        <Text style={{ color:'#fff', fontWeight:'600' }}>Arrosée aujourd’hui</Text>
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
