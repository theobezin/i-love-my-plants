export type PlantId = string;

export type Plant = {
  id: PlantId;
  name: string;
  species?: string;
  frequencyDays: number;        // tous les X jours
  lastWateredAt?: string;       // ISO date string
  createdAt: string;            // ISO
};