//app/add-order.tsx 
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import db from '../src/database/db';
import { usePOStore } from '../src/store/usePOstore';
import { useTheme } from '../src/theme/ThemeContext';
import { scheduleAllDueNotifications } from '../src/notification/notification';

export default function AddOrderScreen() {
  const router = useRouter();
    const { loadOrders } = usePOStore();
    const { theme } = useTheme();                
    const isDark = theme === 'dark';

  const [finishedGoods, setFinishedGoods] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rawMaterials, setRawMaterials] = useState('');
  const [storageLocation, setStorageLocation] = useState('');  
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!finishedGoods.trim()) return Alert.alert('Error', 'Please enter Finished Goods');
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0)
      return Alert.alert('Error', 'Please enter a valid quantity');
    if (!rawMaterials.trim()) return Alert.alert('Error', 'Please enter Raw Materials');
    if (!storageLocation.trim()) return Alert.alert('Error', 'Please enter Storage Location');

    db.runSync(
      `INSERT INTO production_orders 
       (finished_goods, produced_quantity, raw_materials, due_date, storage_location, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        finishedGoods.trim(),
        Number(quantity),
        rawMaterials.trim(),
        dueDate.toISOString().split('T')[0],
        storageLocation.trim(),
        'Pending',
      ]
    );

      loadOrders();
      scheduleAllDueNotifications();
    Alert.alert('Success!', 'New production order created', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView
                style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f3f4f6' }]}
                keyboardShouldPersistTaps="handled"
            >
              <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#374151' }]}>Name of the finished goods to be produced</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        color: isDark ? '#e2e8f0' : '#1f2937',
                        borderColor: isDark ? '#334155' : '#e5e7eb',
                    }]}
                    value={finishedGoods}
                    onChangeText={setFinishedGoods}
                    placeholder="eg: Wireless Earbuds"
                    placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
                />

              <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#374151' }]}>Planned production quantity</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        color: isDark ? '#e2e8f0' : '#1f2937',
                        borderColor: isDark ? '#334155' : '#e5e7eb',
                    }]}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    placeholder="eg: 1200"
                    placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
                />

              <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#374151' }]}>List or description of required raw materials (BOM)（BOM）</Text>
                <TextInput
                    style={[styles.input, styles.multiline, {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        color: isDark ? '#e2e8f0' : '#1f2937',
                        borderColor: isDark ? '#334155' : '#e5e7eb',
                    }]}
                    value={rawMaterials}
                    onChangeText={setRawMaterials}
                    multiline
                    numberOfLines={4}
                  placeholder="eg: plastic casing, lithium battery, motherboard, ear pads"
                    placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
                />

              <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#374151' }]}>Planned completion date</Text>
                <TouchableOpacity
                    style={[styles.dateButton, {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e5e7eb',
                    }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={[styles.dateText, { color: isDark ? '#e2e8f0' : '#1f2937' }]}>
                        {dueDate.toISOString().split('T')[0]}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={dueDate}
                        mode="date"
                        minimumDate={new Date()}
                        onChange={(event, selected) => {
                            setShowDatePicker(false);
                            if (selected) setDueDate(selected);
                        }}
                    />
                )}

              <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#374151' }]}>Warehouse or section where goods will be stored</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        color: isDark ? '#e2e8f0' : '#1f2937',
                        borderColor: isDark ? '#334155' : '#e5e7eb',
                    }]}
                    value={storageLocation}
                    onChangeText={setStorageLocation}
                    placeholder="eg: Warehouse A"
                    placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
                />

                <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#2563eb' }]} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Place an order</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  multiline: { height: 100, textAlignVertical: 'top' },
  dateButton: { backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  dateText: { fontSize: 16 },
  submitButton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30, marginBottom: 50 },
  submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});