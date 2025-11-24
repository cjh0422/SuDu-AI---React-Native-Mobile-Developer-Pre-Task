// 文件路径：app/add-order.tsx   ← 直接覆盖整个文件
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

export default function AddOrderScreen() {
  const router = useRouter();
  const { loadOrders } = usePOStore();

  const [finishedGoods, setFinishedGoods] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rawMaterials, setRawMaterials] = useState('');
  const [storageLocation, setStorageLocation] = useState('');   // ← 已经修复
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
    Alert.alert('Success!', 'New production order created', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Finished Goods</Text>
        <TextInput style={styles.input} value={finishedGoods} onChangeText={setFinishedGoods} placeholder="e.g. Wireless Earbuds" />

        <Text style={styles.label}>Produced Quantity</Text>
        <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="e.g. 1000" />

        <Text style={styles.label}>Raw Materials (BOM)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={rawMaterials}
          onChangeText={setRawMaterials}
          multiline
          numberOfLines={4}
          placeholder="e.g. Plastic casing, Lithium battery, PCB"
        />

        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{dueDate.toISOString().split('T')[0]}</Text>
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

        <Text style={styles.label}>Storage Location</Text>
        <TextInput style={styles.input} value={storageLocation} onChangeText={setStorageLocation} placeholder="e.g. Warehouse A" />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Create Production Order</Text>
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