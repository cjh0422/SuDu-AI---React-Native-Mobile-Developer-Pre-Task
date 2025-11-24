// app/_layout.tsx 
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { initDatabase } from '../src/database/db';  // 你的数据库初始化

export default function RootLayout() {
  useEffect(() => {
    // 启动时创建表 + 插入 demo 数据
    initDatabase();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Production Orders' }} />
      <Stack.Screen name="add-order" options={{ title: 'New Order' }} /> 
      <Stack.Screen name="order-detail" options={{ title: 'Order Detail' }} />
    </Stack>
  );
}