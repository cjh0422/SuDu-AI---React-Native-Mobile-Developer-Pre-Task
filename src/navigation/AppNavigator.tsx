// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import DashboardScreen from '../screens/DashboardScreens';
//import AddOrderScreen from '../screens/AddOrderScreen';
//import OrderDetailScreen from '../screens/OrderDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    // ← NO NavigationContainer here anymore!
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Production Orders' }}
      />
      <Stack.Screen
        name="AddOrder"
        component={AddOrderScreen}
        options={{ title: 'New Order' }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Order Details' }}
      />
    </Stack.Navigator>
  );
}