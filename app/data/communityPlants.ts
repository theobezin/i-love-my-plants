import { Plant } from '@/types';

export const communityPlants: Plant[] = [
  {
    id: 'community-1',
    name: 'Monstera deliciosa',
    species: 'Monstera deliciosa',
    frequencyDays: 7,
    createdAt: new Date().toISOString(),
    imageUri: require('../../assets/images/1.jpg') as unknown as string,
  },
  {
    id: 'community-2',
    name: 'Sansevieria (Snake Plant)',
    species: 'Sansevieria trifasciata',
    frequencyDays: 14,
    createdAt: new Date().toISOString(),
    imageUri: require('../../assets/images/2.jpg') as unknown as string,
  },
  {
    id: 'community-3',
    name: 'Pothos',
    species: 'Epipremnum aureum',
    frequencyDays: 7,
    createdAt: new Date().toISOString(),
    imageUri: require('../../assets/images/3.jpg') as unknown as string,
  },
];
