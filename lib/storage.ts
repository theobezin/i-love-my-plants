import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant, Room } from '@/types';

const PLANTS_KEY = 'ILMP::plants';
const ROOMS_KEY = 'ILMP::rooms';

export async function loadPlants(): Promise<Plant[]> {
  const raw = await AsyncStorage.getItem(PLANTS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Plant[]; } catch { return []; }
}

export async function savePlants(plants: Plant[]): Promise<void> {
  await AsyncStorage.setItem(PLANTS_KEY, JSON.stringify(plants));
}

export async function loadRooms(): Promise<Room[]> {
  const raw = await AsyncStorage.getItem(ROOMS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Room[]; } catch { return []; }
}

export async function saveRooms(rooms: Room[]): Promise<void> {
  await AsyncStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}
