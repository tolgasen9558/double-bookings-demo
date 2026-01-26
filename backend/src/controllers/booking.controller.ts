import { Request, Response } from 'express';
import { pool } from '../db';

interface Slot {
    id: number;
    time: Date;
    total_capacity: number;
    current_bookings: number;
}

// UNSAFE STRATEGY

export const bookUnsafe = async (req: Request, res: Response) => {
    const slotId = 1;
    const { clientName } = req.body;

    try {
        const result = await pool.query<Slot>('SELECT * FROM slots WHERE id = $1', [slotId]);
        const slot = result.rows[0];

        if(slot.current_bookings >= slot.total_capacity) {
            res.status(400).json({ success: false, message: 'Fully Booked' });
            return;
        }

        await new Promise(r => setTimeout(r, 200));

        await pool.query('UPDATE slots SET current_bookings = current_bookings + 1 WHERE id = $1', [slotId]);
        await pool.query('INSERT INTO bookings (slot_id, customer_name) VALUES ($1, $2)', [slotId, clientName]);

        res.json({ success: true, mode: 'UNSAFE'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error'})
    }
}


// SAFE STRATEGY

export const bookSafe = async (req: Request, res: Response) => {
  const slotId = 1;
  const { clientName } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); 

    const result = await client.query<Slot>('SELECT * FROM slots WHERE id = $1 FOR UPDATE', [slotId]);
    const slot = result.rows[0];

    if (slot.current_bookings >= slot.total_capacity) {
      await client.query('ROLLBACK');
      res.status(400).json({ success: false, message: 'Fully Booked' });
      return;
    }

    await client.query('UPDATE slots SET current_bookings = current_bookings + 1 WHERE id = $1', [slotId]);
    await client.query('INSERT INTO bookings (slot_id, customer_name) VALUES ($1, $2)', [slotId, clientName]);

    await client.query('COMMIT');
    res.json({ success: true, mode: 'SAFE' });

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// RESET DEMO
export const resetDemo = async (req: Request, res: Response) => {
    await pool.query('UPDATE slots SET current_bookings = 0 WHERE id = 1');
    await pool.query('DELETE FROM bookings');
    res.json({ message: 'Reset Complete' });
}