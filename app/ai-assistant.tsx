// app/ai-assistant.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { usePOStore } from '../src/store/usePOstore';
import dayjs from 'dayjs';
import { useTheme } from '../src/theme/ThemeContext'; 

export default function AIAssistantScreen() {
    const { orders } = usePOStore();
    const { theme } = useTheme();                 
    const isDark = theme === 'dark';                

    const [insights, setInsights] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generateInsights = () => {
            const newInsights: string[] = [];

            if (orders.length === 0) {
                newInsights.push("The database is empty. Go add the first production order now!");
                newInsights.push("Tips: Click the blue " +" button in the bottom right corner to start.");
                setInsights(newInsights);
                setLoading(false);
                return;
            }

            const urgent = orders
                .filter(o => o.status !== 'Completed')
                .filter(o => dayjs(o.due_date).diff(dayjs(), 'day') <= 7) // 
                .sort((a, b) => dayjs(a.due_date).diff(dayjs(), 'day') - dayjs(b.due_date).diff(dayjs(), 'day')) // 
                .slice(0, 3); // max 3

            urgent.forEach(o => {
                const daysLeft = dayjs(o.due_date).diff(dayjs(), 'day');

                if (daysLeft <= 0) {
                    newInsights.push(`The order(s) must complete by today! Order "${o.finished_goods}" expires today! Quantity : ${o.produced_quantity} `);
                } else if (daysLeft === 1) {
                    newInsights.push(`Very Urgent！${o.finished_goods} Expires tomorrow! Quantity:${o.produced_quantity} `);
                } else if (daysLeft <= 3) {
                    newInsights.push(`Urgent Reminder：${o.finished_goods} left ${daysLeft} expiry days. Quantity:  ${o.produced_quantity} `);
                //} else if (daysLeft < 0) {
                    //newInsights.push(`The order "${o.finished_goods}"" is OVERDUE! Quantity : ${o.produced_quantity} `);
                } else {
                    newInsights.push(`Upcoming Order(s)：${o.finished_goods} still have ${daysLeft} expiry days. Please prepare in advance.`);
                }
            });

            const bigOrder = orders.reduce((a, b) =>
                (a?.produced_quantity || 0) > (b.produced_quantity || 0) ? a : b
            );
            if (bigOrder?.produced_quantity >= 1000) {
                newInsights.push(`Large order reminder:${bigOrder.finished_goods} required. Quantity: ${bigOrder.produced_quantity} . Please prepare in advance.`);
            }

            const complex = orders.find(o => o.raw_materials?.split(',').length >= 4);
            if (complex) {
                newInsights.push(`Complex BOM reminder:${complex.finished_goods} used multiple raw materials, please check the inventory.`);
            }

            const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
            if (inProgressCount > 0) {
                newInsights.push(`Productivity is top-notch! Currently available ${inProgressCount} orders are in progress, excellent.`);
            }

            const encouragements = [
                "The factory is running well, keep it up!",
                "All orders are running smoothly.",
                "Today was another day of high productivity.",
                "The production plan was executed exceptionally well！",
                "The team worked together seamlessly, well done!！"
            ];
            while (newInsights.length < 3) {
                newInsights.push(encouragements[Math.floor(Math.random() * encouragements.length)]);
            }

            setInsights(newInsights);
            setLoading(false);
        };

        generateInsights();
    }, [orders]);

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
            <Text style={[styles.title, { color: isDark ? '#60a5fa' : '#1e40af' }]}>
                AI Product Assistant
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                Real-time analysis of your orders
            </Text>

            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#60a5fa" />
                    <Text style={[styles.loadingText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        AI is analyzing the data...
                    </Text>
                </View>
            ) : (
                <View style={styles.insights}>
                    {insights.map((insight, index) => (
                        <View
                            key={index}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                    shadowOpacity: isDark ? 0.3 : 0.1,
                                    borderWidth: isDark ? 1 : 0,
                                    borderColor: isDark ? '#334155' : 'transparent',
                                },
                            ]}
                        >
                            <Text style={[styles.insightText, { color: isDark ? '#e2e8f0' : '#1f2937' }]}>
                                {insight}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: isDark ? '#64748b' : '#94a3b8' }]}>
                    Local AI · No internet connection required
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginTop: 50 },
    subtitle: { fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 30 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    loadingText: { marginTop: 20, fontSize: 16 },
    insights: { paddingBottom: 20 },
    card: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 8,
    },
    insightText: { fontSize: 17, lineHeight: 28 },
    footer: { padding: 30, alignItems: 'center' },
    footerText: { fontSize: 13, opacity: 0.7 },
});