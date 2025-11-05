import { Room } from "@/types";
import { Link } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';


export default function RoomCard({ room }: { room: Room }) {
   return (
    <Link href={{ pathname: '/rooms/[id]', params: { id: String(room.id) } }} asChild>
      <Pressable style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        padding: 16, marginHorizontal: 16, marginVertical: 8,
        borderRadius: 12, backgroundColor: '#fff', elevation: 2
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{room.name}</Text>
        </View>
      </Pressable>
    </Link>
  );
}