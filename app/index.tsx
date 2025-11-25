// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { usePOStore } from '../src/store/usePOstore';
import { ProductionOrder } from '../src/types';
import { useTheme } from '../src/theme/ThemeContext';
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
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';


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
          style={[
              styles.card,
              {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
              },
          ]}
          onPress={() => router.push({ pathname: '/order-detail', params: { order: JSON.stringify(item) } })}
      >
          {/* Product Name + Status Label */}
          <View style={styles.row}>
              <Text style={[styles.goods, { color: isDark ? '#f1f5f9' : '#111827' }]}>
                  {item.finished_goods}
              </Text>
              <Text style={[styles.status, { backgroundColor: statusColors[item.status] }]}>
                  {item.status}
              </Text>
          </View>

          {/* Quantity and Expiry Date*/}
          <Text style={{ color: isDark ? '#cbd5e1' : '#475569', marginBottom: 8 }}>
              Qty: {item.produced_quantity}
          </Text>
          <Text style={{ color: isDark ? '#cbd5e1' : '#475569', marginBottom: 16 }}>
              Due: {dayjs(item.due_date).format('DD MMM YYYY')}
          </Text>

          {/* Your three favorite status toggle buttons! */}
          <View style={styles.statusButtons}>
              {(['Pending', 'In Progress', 'Completed'] as const).map((s) => (
                  <TouchableOpacity
                      key={s}
                      onPress={() => updateStatus(item.id, s)}
                      style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 20,
                          backgroundColor: item.status === s ? '#2563eb' : 'transparent',
                          borderWidth: 1,
                          borderColor: item.status === s ? '#2563eb' : (isDark ? '#475569' : '#94a3b8'),
                      }}
                  >
                      <Text style={{
                          color: item.status === s ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
                          fontSize: 12,
                          fontWeight: item.status === s ? 'bold' : 'normal',
                      }}>
                          {s}
                      </Text>
                  </TouchableOpacity>
              ))}
          </View>
      </TouchableOpacity>
  );

  return (
      <View style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f3f4f6' }]}>
          <TextInput
              style={[styles.search, {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#e2e8f0' : '#1e293b',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
              }]}
              placeholder="Search by product or status..."
              placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
              value={search}
              onChangeText={setSearch}
          />

              <FlatList
                  data={filtered}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItem}
              ListEmptyComponent={<Text>No orders found</Text>}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                  <View style={{ height: 100 }} />
              }
              overScrollMode="always"
              showsVerticalScrollIndicator={false}

              ListFooterComponentStyle={{

                  marginBottom: -80,
              }}

              refreshing={false}
              onRefresh={() => {
                  loadOrders();

              }}
          />
          <TouchableOpacity
              style={[
                  styles.themeToggle,
                  { backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9' }
              ]}
              onPress={toggleTheme}
          >
              <Text style={{ fontSize: 16, color: theme === 'dark' ? '#f8fafc' : '#475569' }}>
                  {theme === 'dark' ? '🌙' : '☀️'}
              </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-order')}>
              <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.fab, { bottom: 100, backgroundColor: '#7c3aed' }]}
              onPress={() => router.push('/ai-assistant')}
          >
              <Text style={styles.fabText}>AI</Text>
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
  fab: { position: 'absolute', right: 20, bottom: 15, backgroundColor: '#2563eb', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 36 },
  themeToggle: {
        position: 'absolute',
        left: 20,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,   
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

});