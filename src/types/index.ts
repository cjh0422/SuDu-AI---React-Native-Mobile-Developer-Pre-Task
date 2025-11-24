export type Status = 'Pending' | 'In Progress' | 'Completed';

export interface ProductionOrder {
    id: number;
    finished_goods: string;
    produced_quantity: number;
    raw_materials: string;
    due_date: string;        // ISO string or "2025-12-25"
    storage_location: string;
    status: Status;
    created_at?: string;
}