import { View, Text, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePlants } from '@/context/PlantsContext';

export default function PlantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlant, waterPlant, removePlant } = usePlants();
  const plant = id ? getPlant(id) : undefined;

  if (!plant) {
    return <View style={{ padding: 16 }}><Text>Plante introuvable.</Text></View>;
  }

  const last = plant.lastWateredAt ? new Date(plant.lastWateredAt).toLocaleDateString() : 'jamais';

  return (
    <View style={{ padding: 16, gap: 12 }}>
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
    </View>
  );
}
