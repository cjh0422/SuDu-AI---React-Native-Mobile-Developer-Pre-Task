// src/notifications/scheduleDueNotifications.ts

import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import { usePOStore } from '../store/usePOstore';

export const scheduleAllDueNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const { orders } = usePOStore.getState();
    const now = dayjs();

    for (const order of orders) {
        if (order.status === 'Completed') continue;

        const dueDate = dayjs(order.due_date);
        const daysLeft = dueDate.diff(now, 'day');

        // 明天到期
        if (daysLeft === 1) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '紧急！明天交货',
                    body: `${order.finished_goods} 明天（${dueDate.format('MM月DD日')}）到期！数量 ${order.produced_quantity} 件`,
                    sound: true,
                },
                trigger: {
                    hour: 8,
                    minute: 0,
                    repeats: false,
                } as Notifications.CalendarTriggerInput, 
            });
        }

        // 还有 3 天
        if (daysLeft === 3) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '提醒：还有 3 天交货',
                    body: `${order.finished_goods} 将于 ${dueDate.format('MM月DD日')} 交货，请准备生产`,
                },
                trigger: {
                    hour: 9,
                    minute: 0,
                    repeats: false,
                } as Notifications.CalendarTriggerInput,
            });
        }

        // 今天到期
        if (daysLeft === 0 && dueDate.isAfter(now)) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '今天必须完成！',
                    body: `${order.finished_goods} 今天到期！数量 ${order.produced_quantity} 件`,
                    sound: true,
                },
                trigger: { seconds: 10 } as any,
            });
        }
    }
};