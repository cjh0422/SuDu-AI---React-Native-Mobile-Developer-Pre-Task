import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function App() {
    // Fake data (we'll use real database later)
    const orders = [
        { id: 1, product: "Wireless Earbuds", qty: 500, due: "2025-12-20", status: "In Progress" },
        { id: 2, product: "Gaming Mouse", qty: 1200, due: "2025-12-15", status: "Pending" },
        { id: 3, product: "Mechanical Keyboard", qty: 800, due: "2025-11-30", status: "Completed" },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Production Orders</Text>

            <ScrollView style={styles.list}>
                {orders.map(order => (
                    <View key={order.id} style={styles.card}>
                        <Text style={styles.product}>{order.product}</Text>
                        <Text>Quantity: {order.qty}</Text>
                        <Text>Due Date: {order.due}</Text>
                        <Text style={[styles.status,
                        order.status === "Completed" ? styles.completed :
                            order.status === "In Progress" ? styles.progress : styles.pending
                        ]}>
                            {order.status}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0', paddingTop: 50 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    list: { paddingHorizontal: 20 },
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    product: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    status: {
        marginTop: 8,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    pending: { backgroundColor: '#f59e0b' },
    progress: { backgroundColor: '#3b82f6' },
    completed: { backgroundColor: '#10b981' },
});
