import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Plant } from '@/types';

function daysUntilNextWatering(p: Plant): number | null {
  if (!p.lastWateredAt) return null;
  const last = new Date(p.lastWateredAt);
  const next = new Date(last);
  next.setDate(last.getDate() + p.frequencyDays);
  const diff = Math.ceil((+next - Date.now()) / (1000*60*60*24));
  return diff;
}

export default function PlantCard({ plant }: { plant: Plant }) {
  const d = daysUntilNextWatering(plant);

  return (
    <Link href={`/plants/${plant.id}`} asChild>
      <Pressable style={{
        padding: 16, marginHorizontal: 16, marginVertical: 8,
        borderRadius: 12, backgroundColor: '#fff', elevation: 2
      }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{plant.name}</Text>
        {plant.species ? <Text style={{ opacity: 0.7 }}>{plant.species}</Text> : null}
        <Text style={{ marginTop: 8 }}>
          {d === null ? 'Jamais arrosée' :
            d <= 0 ? 'À arroser aujourd’hui' :
            `Prochain arrosage dans ${d} j`}
        </Text>
      </Pressable>
    </Link>
  );
}
