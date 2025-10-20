import { loadPlants, savePlants } from '@/lib/storage';
import { Plant, PlantId } from '@/types';
import { randomUUID } from 'expo-crypto';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type PlantsState = {
  plants: Plant[];
  addPlant: (p: Omit<Plant,'id'|'createdAt'>) => Promise<void>;
  removePlant: (id: PlantId) => Promise<void>;
  waterPlant: (id: PlantId, date?: Date) => Promise<void>;
  getPlant: (id: PlantId) => Plant | undefined;
  updatePlant: (id: PlantId, patch: Partial<Plant>) => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<PlantsState | null>(null);

export function PlantsProvider({ children }: { children: React.ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    const data = await loadPlants();
    setPlants(data);
  }

  async function persist(next: Plant[]) {
    setPlants(next);
    await savePlants(next);
  }

  async function addPlant(p: Omit<Plant,'id'|'createdAt'>) {
    const now = new Date().toISOString();
    const plant: Plant = { ...p, id: randomUUID(), createdAt: now };
    await persist([plant, ...plants]);
  }

  async function removePlant(id: PlantId) {
    await persist(plants.filter(p => p.id !== id));
  }

  async function updatePlant(id: PlantId, patch: Partial<Plant>) {
    await persist(plants.map(p => p.id === id ? { ...p, ...patch } : p));
  }

  async function waterPlant(id: PlantId, date = new Date()) {
    await updatePlant(id, { lastWateredAt: date.toISOString() });
  }

  function getPlant(id: PlantId) {
    return plants.find(p => p.id === id);
  }

  const value = useMemo(() => ({
    plants, addPlant, removePlant, waterPlant, getPlant, updatePlant, refresh
  }), [plants]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlants() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePlants must be used within PlantsProvider');
  return ctx;
}
