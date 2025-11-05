import { loadPlants, savePlants, loadRooms, saveRooms } from '@/lib/storage';
import { Plant, PlantId, Room, RoomId } from '@/types';
import { randomUUID } from 'expo-crypto';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type PlantsState = {
  plants: Plant[];
  rooms: Room[];
  addPlant: (p: Omit<Plant,'id'|'createdAt'>) => Promise<void>;
  removePlant: (id: PlantId) => Promise<void>;
  waterPlant: (id: PlantId, date?: Date) => Promise<void>;
  getPlant: (id: PlantId) => Plant | undefined;
  updatePlant: (id: PlantId, patch: Partial<Plant>) => Promise<void>;
  addRoom: (name: string) => Promise<void>;
  removeRoom: (id: RoomId) => Promise<void>;
  updateRoom: (id: RoomId, patch: Partial<Room>) => Promise<void>;
  addPlantToRoom: (plantId: PlantId, roomId: RoomId) => Promise<void>;
  removePlantFromRoom: (plantId: PlantId, roomId: RoomId) => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<PlantsState | null>(null);

export function PlantsProvider({ children }: { children: React.ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    const [plantsData, roomsData] = await Promise.all([
      loadPlants(),
      loadRooms()
    ]);
    setPlants(plantsData);
    setRooms(roomsData || []);
  }

  async function persistPlants(next: Plant[]) {
    setPlants(next);
    await savePlants(next);
  }

  async function persistRooms(next: Room[]) {
    setRooms(next);
    await saveRooms(next);
  }

  async function addPlant(p: Omit<Plant,'id'|'createdAt'>) {
    const now = new Date().toISOString();
    const plant: Plant = { ...p, id: randomUUID(), createdAt: now };
    await persistPlants([plant, ...plants]);
  }

  async function removePlant(id: PlantId) {
    await persistPlants(plants.filter(p => p.id !== id));
    // Remove plant from all rooms
    const updatedRooms = rooms.map(room => ({
      ...room,
      plantIds: room.plantIds.filter(pid => pid !== id)
    }));
    await persistRooms(updatedRooms);
  }

  async function updatePlant(id: PlantId, patch: Partial<Plant>) {
    await persistPlants(plants.map(p => p.id === id ? { ...p, ...patch } : p));
  }

  async function waterPlant(id: PlantId, date = new Date()) {
    await updatePlant(id, { lastWateredAt: date.toISOString() });
  }

  async function addRoom(name: string) {
    const room: Room = { id: randomUUID(), name, plantIds: [] };
    await persistRooms([...rooms, room]);
  }

  async function removeRoom(id: RoomId) {
    await persistRooms(rooms.filter(r => r.id !== id));
  }

  async function updateRoom(id: RoomId, patch: Partial<Room>) {
    await persistRooms(rooms.map(r => r.id === id ? { ...r, ...patch } : r));
  }

  async function addPlantToRoom(plantId: PlantId, roomId: RoomId) {
    const room = rooms.find(r => r.id === roomId);
    if (!room || room.plantIds.includes(plantId)) return;
    
    await updateRoom(roomId, {
      plantIds: [...room.plantIds, plantId]
    });
  }

  async function removePlantFromRoom(plantId: PlantId, roomId: RoomId) {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    
    await updateRoom(roomId, {
      plantIds: room.plantIds.filter(id => id !== plantId)
    });
  }

  function getPlant(id: PlantId) {
    return plants.find(p => p.id === id);
  }

  const value = useMemo(() => ({
    plants,
    rooms,
    addPlant,
    removePlant,
    waterPlant,
    getPlant,
    updatePlant,
    addRoom,
    removeRoom,
    updateRoom,
    addPlantToRoom,
    removePlantFromRoom,
    refresh
  }), [plants, rooms]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlants() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePlants must be used within PlantsProvider');
  return ctx;
}
