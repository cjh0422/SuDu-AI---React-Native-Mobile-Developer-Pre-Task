// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { usePOStore } from '../src/store/usePOstore';
import { ProductionOrder } from '../src/types';
import dayjs from 'dayjs';

type Status = 'Pending' | 'In Progress' | 'Completed';

const statusColors: Record<Status, string> = {
  Pending: '#f59e0b',
  'In Progress': '#3b82f6',
  Completed: '#10b981',
};

export default function DashboardScreen() {
  const { orders, loadOrders, updateStatus } = usePOStore();
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.finished_goods.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: ProductionOrder }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/order-detail', params: { order: JSON.stringify(item) } })}
    >
      <View style={styles.row}>
        <Text style={styles.goods}>{item.finished_goods}</Text>
        <Text style={[styles.status, { backgroundColor: statusColors[item.status] }]}>
          {item.status}
        </Text>
      </View>
      <Text>Qty: {item.produced_quantity}</Text>
      <Text>Due: {dayjs(item.due_date).format('DD MMM YYYY')}</Text>
      <View style={styles.statusButtons}>
        {(['Pending', 'In Progress', 'Completed'] as Status[]).map((s) => (
          <TouchableOpacity key={s} onPress={() => updateStatus(item.id, s)} style={{ padding: 6 }}>
            <Text style={{ fontSize: 12, color: item.status === s ? '#2563eb' : '#666' }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search by product or status..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No orders found</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-order')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  search: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  goods: { fontSize: 18, fontWeight: 'bold' },
  status: { color: '#fff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, fontSize: 12 },
  statusButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#2563eb', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 36 },
});