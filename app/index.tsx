import EmptyState from '@/components/EmptyState';
import PlantCard from '@/components/PlantCard';
import { usePlants } from '@/context/PlantsContext';
import { Link } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Pressable, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { communityPlants } from './data/communityPlants';

export default function Home() {
  const { plants } = usePlants();
  const [tab, setTab] = useState<'mine' | 'community'>('mine');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  useEffect(() => {
    Animated.timing(indicatorAnim, { toValue: tab === 'mine' ? 0 : 1, duration: 250, useNativeDriver: true }).start();
  }, [tab, indicatorAnim]);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Welcome infography (replace image file with your own) */}
      <Animated.View style={{ padding: 24, alignItems: 'center', opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }}>
        <Image source={require('@/assets/images/ilmp-logo.png')} style={{ width: 140, height: 140 }} />
        <Text style={{ marginTop: 12, fontSize: 20, fontWeight: '700' }}>Bienvenue sur I love my plants !</Text>
        <Text style={{ opacity: 0.7, textAlign: 'center', marginTop: 8 }}>Prends soin de tes plantes et découvre celles de la communauté.</Text>
      </Animated.View>

      {/* Tabs */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 6, elevation: 1 }}>
          <TouchableOpacity onPress={() => setTab('mine')} style={{ flex: 1 }}>
            <View style={{ paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ fontWeight: tab === 'mine' ? '700' : '500', color: tab === 'mine' ? '#2e7d32' : '#333' }}>Mes plantes</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('community')} style={{ flex: 1 }}>
            <View style={{ paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ fontWeight: tab === 'community' ? '700' : '500', color: tab === 'community' ? '#2e7d32' : '#333' }}>Plantes de la communauté</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* Sliding indicator */}
        <View style={{ height: 4, marginTop: 6, overflow: 'hidden' }}>
          <Animated.View style={{ height: 4, width: width / 2 - 32, backgroundColor: '#2e7d32', borderRadius: 4, transform: [{ translateX: indicatorAnim.interpolate({ inputRange: [0, 1], outputRange: [0, width / 2 - 16] }) }] }} />
        </View>
      </View>

      {/* Tab content */}
      {tab === 'mine' ? (
        plants.length === 0 ? (
          <EmptyState message="Aucune plante pour l’instant. Ajoute ta première !" />
        ) : (
          <FlatList
            data={plants}
            keyExtractor={(p) => p.id}
            renderItem={({ item }) => <PlantCard plant={item} />}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )
      ) : (
        <FlatList
          data={communityPlants}
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
