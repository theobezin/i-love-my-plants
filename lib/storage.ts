import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant } from '@/types';

const KEY = 'ILMP::plants';

export async function loadPlants(): Promise<Plant[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Plant[]; } catch { return []; }
}

export async function savePlants(plants: Plant[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(plants));
}