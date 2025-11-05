import EmptyState from '@/components/EmptyState';
import PlantCard from '@/components/PlantCard';
import { usePlants } from '@/context/PlantsContext';
import { Link } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Pressable, Text, TouchableOpacity, View, useWindowDimensions, Alert, Modal, TextInput, Platform } from 'react-native';

export default function Home() {
  const { plants, rooms, addRoom, removeRoom } = usePlants();
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
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
      {/* infography  */}
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
              <Text style={{ fontWeight: tab === 'community' ? '700' : '500', color: tab === 'community' ? '#2e7d32' : '#333' }}>Pièces</Text>
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
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Pièces</Text>
            <Pressable
              onPress={() => setRoomModalVisible(true)}
              style={{ backgroundColor: '#1565c0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
            >
              <Text style={{ color: '#fff' }}>Ajouter</Text>
            </Pressable>
          </View>

          {rooms.length === 0 ? (
              <EmptyState message="Aucune pièce. Ajoutez-en une pour commencer!" />
            ) : (
            <FlatList
              data={rooms}
              keyExtractor={(r) => r.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80, gap: 12 }}
              renderItem={({ item: room }) => {
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
                        marginBottom: 8
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                          <Text style={{ fontSize: 18, fontWeight: '600' }}>{room.name}</Text>
                          <Text style={{ opacity: 0.7 }}>{roomPlants.length} plante{roomPlants.length !== 1 ? 's' : ''}</Text>
                        </View>
                        <Pressable
                          onPress={(e) => {
                            e.preventDefault();
                            Alert.alert(
                              'Supprimer la pièce',
                              `Voulez-vous supprimer "${room.name}" ?`,
                              [
                                { text: 'Annuler', style: 'cancel' },
                                { text: 'Supprimer', style: 'destructive', onPress: () => removeRoom(room.id) }
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
              }}
            />
          )}
        </View>
      )}
      {/* Add plant floating button */}
      {tab === 'mine' && (
        <Link href="/add" asChild>
          <Pressable style={{
            position: 'absolute', right: 16, bottom: 16,
            backgroundColor: '#2e7d32', paddingHorizontal: 20, paddingVertical: 14,
            borderRadius: 28, elevation: 3
          }}>
            <Text style={{ color: 'white', fontWeight: '600' }}>Ajouter</Text>
          </Pressable>
        </Link>
      )}

      {/* Modal for adding a room */}
      <Modal
        visible={roomModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRoomModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Nouvelle pièce</Text>
            <TextInput
              value={newRoomName}
              onChangeText={setNewRoomName}
              placeholder="Nom de la pièce"
              autoFocus
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Pressable onPress={() => { setRoomModalVisible(false); setNewRoomName(''); }} style={{ padding: 10 }}>
                <Text style={{ color: '#666' }}>Annuler</Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  const name = newRoomName?.trim();
                  if (!name) return;
                  await addRoom(name);
                  setNewRoomName('');
                  setRoomModalVisible(false);
                }}
                style={{ backgroundColor: '#1565c0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
              >
                <Text style={{ color: '#fff' }}>Créer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
