// app/ai-assistant.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { usePOStore } from '../src/store/usePOstore';
import dayjs from 'dayjs';

export default function AIAssistantScreen() {
    const { orders } = usePOStore();
    const [insights, setInsights] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 模拟 AI 分析（本地规则引擎）
        const generateInsights = () => {
            const newInsights: string[] = [];

            if (orders.length === 0) {
                newInsights.push("数据库为空，赶紧去添加第一个生产订单吧！");
                newInsights.push("提示：点击右下角蓝色 + 按钮开始");
                setInsights(newInsights);
                setLoading(false);
                return;
            }

            // 1. 紧急订单（明天或今天到期）
            const urgent = orders
                .filter(o => o.status !== 'Completed')
                .find(o => {
                    const daysLeft = dayjs(o.due_date).diff(dayjs(), 'day');
                    return daysLeft <= 3;
                });
            if (urgent) {
                const days = dayjs(urgent.due_date).diff(dayjs(), 'day');
                newInsights.push(`紧急提醒：${urgent.finished_goods} 还有 ${days} 天到期！数量 ${urgent.produced_quantity} 件`);
            }

            // 2. 大批量订单
            const bigOrder = orders.reduce((prev, current) =>
                (prev?.produced_quantity || 0) > (current.produced_quantity) ? prev : current
            );
            if (bigOrder.produced_quantity >= 1000) {
                newInsights.push(`大订单提醒：${bigOrder.finished_goods} 需要生产 ${bigOrder.produced_quantity} 件，建议提前备料`);
            }

            // 3. 原材料复杂订单
            const complex = orders.find(o =>
                o.raw_materials && o.raw_materials.split(',').length >= 4
            );
            if (complex) {
                newInsights.push(`复杂 BOM 提醒：${complex.finished_goods} 使用多种原材料，请检查库存`);
            }

            // 4. 即将完成趋势
            const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
            const pendingCount = orders.filter(o => o.status === 'Pending').length;
            if (inProgressCount > pendingCount && inProgressCount > 0) {
                newInsights.push(`生产力满分！目前有 ${inProgressCount} 个订单正在进行中，效率很高`);
            }

            // 5. 随机鼓励
            const encouragements = [
                "工厂运行良好，继续保持！",
                "所有订单都在正轨上运行",
                "今天又是高效生产的一天",
                "生产计划执行得非常棒！",
                "团队配合默契，干得漂亮！"
            ];
            if (newInsights.length < 3) {
                newInsights.push(encouragements[Math.floor(Math.random() * encouragements.length)]);
            }

            // 保证至少有 2 条
            while (newInsights.length < 2) {
                newInsights.push("一切正常，生产平稳进行");
            }

            setInsights(newInsights);
            setLoading(false);
        };

        generateInsights();
    }, [orders]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>AI 生产助手</Text>
            <Text style={styles.subtitle}>实时分析您的生产订单</Text>

            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#2563eb" />
                    <Text style={styles.loadingText}>AI 正在分析数据...</Text>
                </View>
            ) : (
                <View style={styles.insights}>
                    {insights.map((insight, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.insightText}>{insight}</Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>本地 AI · 无需联网 · 数据永不离开手机</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 40, color: '#1e40af' },
    subtitle: { fontSize: 16, textAlign: 'center', color: '#64748b', marginTop: 10, marginBottom: 30 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    loadingText: { marginTop: 20, fontSize: 16, color: '#64748b' },
    insights: { padding: 20 },
    card: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    insightText: { fontSize: 17, lineHeight: 26, color: '#1f2937' },
    footer: { padding: 20, alignItems: 'center' },
    footerText: { fontSize: 12, color: '#94a3b8' },
});