// app/order-detail.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';

export default function OrderDetailScreen() {
  const { order } = useLocalSearchParams();
  
  if (!order || typeof order !== 'string') {
    return (
      <View style={styles.center}>
        <Text>订单数据丢失</Text>
      </View>
    );
  }

  const data = JSON.parse(order);

  const statusColor = 
    data.status === 'Completed' ? '#10b981' :
    data.status === 'In Progress' ? '#3b82f6' : '#f59e0b';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{data.finished_goods}</Text>

      <View style={styles.info}>
        <Text style={styles.label}>数量</Text>
        <Text style={styles.value}>{data.produced_quantity.toLocaleString()}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>状态</Text>
        <Text style={[styles.status, { backgroundColor: statusColor }]}>
          {data.status}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>交货日期</Text>
        <Text style={styles.value}>{dayjs(data.due_date).format('YYYY年MM月DD日')}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>原材料</Text>
        <Text style={styles.value}>{data.raw_materials || '未填写'}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>存储位置</Text>
        <Text style={styles.value}>{data.storage_location}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  info: { marginBottom: 22 },
  label: { fontSize: 16, color: '#6b7280', marginBottom: 6 },
  value: { fontSize: 18, color: '#111827' },
  status: { 
    alignSelf: 'flex-start', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    color: 'white', 
    fontWeight: 'bold' 
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});