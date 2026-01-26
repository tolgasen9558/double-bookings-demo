import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/booking.routes';
import { pool } from './db';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', bookingRoutes);

const PORT = process.env.PORT || 3000;

async function initDB() {
  try {
    console.log("Auto-fixing database tables...");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS slots (
        id SERIAL PRIMARY KEY,
        time TIMESTAMP NOT NULL,
        total_capacity INTEGER NOT NULL,
        current_bookings INTEGER DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        slot_id INTEGER REFERENCES slots(id),
        customer_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const slotCheck = await pool.query('SELECT * FROM slots WHERE id = 1');
    if (slotCheck.rowCount === 0) {
      await pool.query(`
        INSERT INTO slots (id, time, total_capacity, current_bookings)
        VALUES (1, NOW(), 1, 0)
      `);
      console.log("Inserted initial slot.");
    }
    
    console.log("✅ Database ready.");
  } catch (err) {
    console.error("Database init failed:", err);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
});
