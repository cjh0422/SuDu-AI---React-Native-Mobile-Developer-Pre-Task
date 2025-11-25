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
                    title: 'Urgent! Orders required tomorrow.',
                    body: `${order.finished_goods} due tommorrow（${dueDate.format('MM月DD日')}）！Quantity: ${order.produced_quantity} `,
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
                    title: 'Reminder: 3 days left',
                    body: `${order.finished_goods} shall hand in by ${dueDate.format('MM月DD日')} .Please prepare for production.`,
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
                    title: 'Must be completed today！',
                    body: `${order.finished_goods} due today! Quantity ${order.produced_quantity} `,
                    sound: true,
                },
                trigger: { seconds: 10 } as any,
            });
        }
    }
};