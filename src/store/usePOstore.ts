// src/store/usePOStore.ts
import { create } from 'zustand';
import db from '../database/db';          // ← THIS IS THE CORRECT IMPORT
import type { ProductionOrder } from '../types';

interface POStore {
  orders: ProductionOrder[];
  loadOrders: () => void;
  updateStatus: (id: number, status: 'Pending' | 'In Progress' | 'Completed') => void;
}

export const usePOStore = create<POStore>((set) => ({
  orders: [],

  loadOrders: () => {
    const rows = db.getAllSync<ProductionOrder>(
      'SELECT * FROM production_orders ORDER BY due_date ASC'
    );
    set({ orders: rows });
  },

  updateStatus: (id, status) => {
    db.runSync('UPDATE production_orders SET status = ? WHERE id = ?', [status, id]);
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  },
}));