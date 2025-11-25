// app/order-detail.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';
import { useTheme } from '../src/theme/ThemeContext'; 

export default function OrderDetailScreen() {
    const { order } = useLocalSearchParams();
    const { theme } = useTheme();                   
    const isDark = theme === 'dark';           

    if (!order || typeof order !== 'string') {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? '#0f172a' : '#f9fafb' }]}>
                <Text style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>订单数据丢失</Text>
            </View>
        );
    }

    const data = JSON.parse(order);

    const statusColor =
        data.status === 'Completed' ? '#10b981' :
            data.status === 'In Progress' ? '#3b82f6' : '#f59e0b';

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f9fafb' }]}>
            <Text style={[styles.title, { color: isDark ? '#f1f5f9' : '#111827' }]}>
                {data.finished_goods}
            </Text>
            <View style={[styles.idCard, {
                backgroundColor: isDark ? '#1e293b' : '#eff6ff',
                borderColor: isDark ? '#334155' : '#dbeafe'
            }]}>
                <Text style={[styles.idLabel, { color: isDark ? '#94a3b8' : '#6b7280' }]}>
                    订单编号
                </Text>
                <Text style={[styles.idValue, { color: isDark ? '#60a5fa' : '#2563eb' }]}>
                    #{String(data.id).padStart(5, '0')}
                </Text>
            </View>

            <View style={styles.info}>
                <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#6b7280' }]}>Quantity</Text>
                <Text style={[styles.value, { color: isDark ? '#e2e8f0' : '#111827' }]}>
                    {data.produced_quantity.toLocaleString()}
                </Text>
            </View>

            <View style={styles.info}>
                <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#6b7280' }]}>Status</Text>
                <Text style={[styles.status, { backgroundColor: statusColor }]}>
                    {data.status}
                </Text>
            </View>

            <View style={styles.info}>
                <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#6b7280' }]}>Due Date</Text>
                <Text style={[styles.value, { color: isDark ? '#e2e8f0' : '#111827' }]}>
                    {dayjs(data.due_date).format('YYYY年MM月DD日')}
                </Text>
            </View>

            <View style={styles.info}>
                <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#6b7280' }]}>Raw materials</Text>
                <Text style={[styles.value, { color: isDark ? '#e2e8f0' : '#111827' }]}>
                    {data.raw_materials || '未填写'}
                </Text>
            </View>

            <View style={styles.info}>
                <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#6b7280' }]}>Location</Text>
                <Text style={[styles.value, { color: isDark ? '#e2e8f0' : '#111827' }]}>
                    {data.storage_location}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
    idCard: {
        paddingVertical: 24,
        paddingHorizontal: 32,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 30,
        borderWidth: 1,
    },
    idLabel: { fontSize: 15, marginBottom: 8 },
    idValue: {
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: 3,
        marginTop: 4,
    },
    info: { marginBottom: 28 },
    label: { fontSize: 16, marginBottom: 6 },
    value: { fontSize: 18, fontWeight: '500' },
    status: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});