import { usePlants } from '@/context/PlantsContext';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';

export default function AddPlant() {
  const { addPlant } = usePlants();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [frequencyDays, setFrequencyDays] = useState('7');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const identifyPlant = async (imageUri: string): Promise<void> => {
    try {
      setLoading(true);
      // Convert image to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          const base64data = (reader.result as string).split(',')[1];
          
          // Make API call to Plant.id
          try {
            const apiRes = await axios.post('https://api.plant.id/v2/identify', {
              images: [base64data],
              plant_details: ["common_names", "wiki_description", "watering_description"]
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Api-Key': process.env.EXPO_PUBLIC_PLANT_ID_API_KEY
              }
            });

            if (apiRes.data.suggestions && apiRes.data.suggestions.length > 0) {
              const plant = apiRes.data.suggestions[0];
              setSpecies(plant.plant_name);
              
              // Set watering frequency based on watering description
              const wateringDesc = plant.plant_details.watering_description?.toLowerCase() || '';
              if (wateringDesc.includes('daily')) setFrequencyDays('1');
              else if (wateringDesc.includes('twice a week')) setFrequencyDays('3');
              else if (wateringDesc.includes('weekly')) setFrequencyDays('7');
              else if (wateringDesc.includes('biweekly')) setFrequencyDays('14');
              else if (wateringDesc.includes('monthly')) setFrequencyDays('30');
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to identify plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const takePicture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera access is required to take pictures');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await identifyPlant(result.assets[0].uri);
    }
  };

  async function onSave() {
    const freq = parseInt(frequencyDays, 10);
    if (!name || !freq || freq <= 0) {
      Alert.alert('Oups', 'Nom et fréquence (>0) sont requis.');
      return;
    }
    await addPlant({ name, species: species || undefined, frequencyDays: freq, imageUri: image || undefined });
    router.replace('/');
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Pressable onPress={takePicture} style={{ backgroundColor: '#1976d2', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Prendre une photo de la plante</Text>
      </Pressable>

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 8 }}
          resizeMode="cover"
        />
      )}

      {loading && (
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Image
            source={require('../assets/images/ilmp-logo.png')}
            style={{ width: 64, height: 64, marginBottom: 8 }}
            resizeMode="contain"
          />
          <Text style={{ textAlign: 'center' }}>Identification de la plante en cours...</Text>
        </View>
      )}

      <Text>Nom *</Text>
      <TextInput value={name} onChangeText={setName}
        placeholder="Mon ficus" style={{ backgroundColor:'#fff', padding:12, borderRadius:8 }} />
      <Text>Espèce (identifiée automatiquement)</Text>
      <TextInput value={species} onChangeText={setSpecies}
        placeholder="Ficus elastica" style={{ backgroundColor:'#fff', padding:12, borderRadius:8 }} />
      <Text>Fréquence d'arrosage (jours) *</Text>
      <TextInput value={frequencyDays} onChangeText={setFrequencyDays} keyboardType="number-pad"
        style={{ backgroundColor:'#fff', padding:12, borderRadius:8 }} />

      <Pressable onPress={onSave} style={{ backgroundColor:'#2e7d32', padding:14, borderRadius:10, alignItems:'center' }}>
        <Text style={{ color:'#fff', fontWeight:'600' }}>Enregistrer</Text>
      </Pressable>
    </View>
  );
}
