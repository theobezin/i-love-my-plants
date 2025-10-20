import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { usePlants } from '@/context/PlantsContext';
import { router } from 'expo-router';

export default function AddPlant() {
  const { addPlant } = usePlants();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [frequencyDays, setFrequencyDays] = useState('7');

  async function onSave() {
    const freq = parseInt(frequencyDays, 10);
    if (!name || !freq || freq <= 0) {
      Alert.alert('Oups', 'Nom et fréquence (>0) sont requis.');
      return;
    }
    await addPlant({ name, species: species || undefined, frequencyDays: freq });
    router.replace('/');
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Nom *</Text>
      <TextInput value={name} onChangeText={setName}
        placeholder="Mon ficus" style={{ backgroundColor:'#fff', padding:12, borderRadius:8 }} />
      <Text>Espèce (optionnel)</Text>
      <TextInput value={species} onChangeText={setSpecies}
        placeholder="Ficus elastica" style={{ backgroundColor:'#fff', padding:12, borderRadius:8 }} />
      <Text>Fréquence d’arrosage (jours) *</Text>
      <TextInput value={frequencyDays} onChangeText={setFrequencyDays} keyboardType="number-pad"
        style={{ backgroundColor:'#fff', padding:12, borderRadius:8 }} />

      <Pressable onPress={onSave} style={{ backgroundColor:'#2e7d32', padding:14, borderRadius:10, alignItems:'center' }}>
        <Text style={{ color:'#fff', fontWeight:'600' }}>Enregistrer</Text>
      </Pressable>
    </View>
  );
}
