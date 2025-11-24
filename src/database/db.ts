import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('po.db');

export const initDatabase = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS production_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      finished_goods TEXT NOT NULL,
      produced_quantity INTEGER NOT NULL,
      raw_materials TEXT,
      due_date TEXT NOT NULL,
      storage_location TEXT,
      status TEXT CHECK(status IN ('Pending','In Progress','Completed')) DEFAULT 'Pending',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Insert some demo data the first time
  const result = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM production_orders');
  if ((result?.count ?? 0) === 0) {
    db.runSync(
      `INSERT INTO production_orders 
       (finished_goods, produced_quantity, raw_materials, due_date, storage_location, status) VALUES 
       ('Wireless Earbuds', 500, 'Plastic casing, Lithium battery, Chips', '2025-12-20', 'Warehouse A', 'In Progress'),
       ('Gaming Mouse', 1200, 'PCB, Sensors, Cable', '2025-12-15', 'Warehouse B', 'Pending'),
       ('Mechanical Keyboard', 800, 'Switches, Keycaps, Aluminum case', '2025-11-30', 'Warehouse A', 'Completed');`
    );
  }
};
export default db;
