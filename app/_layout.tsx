// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { initDatabase } from '../src/database/db';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { authenticate } from '../src/auth/LocalAuth';
import { View, ActivityIndicator, Text } from 'react-native';

export default function RootLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initDatabase();

        const checkAuth = async () => {
            const success = await authenticate(); // Identify user everytime app loads
            setIsAuthenticated(success);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    if (isLoading || !isAuthenticated) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
                <ActivityIndicator size="large" color="#60a5fa" />
                <Text style={{ color: '#e2e8f0', marginTop: 20, fontSize: 16 }}>
                    Verifying Identity...
                </Text>
            </View>
        );
    }
    return (
        <ThemeProvider>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Production Orders' }} />
                <Stack.Screen name="add-order" options={{ title: 'New Order' }} />
                <Stack.Screen name="order-detail" options={{ title: 'Order Details' }} />
                <Stack.Screen name="ai-assistant" options={{ title: 'AI Assistant' }} />
            </Stack>
        </ThemeProvider>
    );
}