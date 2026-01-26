import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'salonkee_demo',
    password: process.env.DB_PASS || 'root',
    port: 5432,
    ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false
});