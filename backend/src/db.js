import pg from 'pg';
import 'dotenv/config';

const needsSsl = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('sslmode=require');
const ssl = needsSsl ? { rejectUnauthorized: false } : false;
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl });
export const query = (text, params) => pool.query(text, params);
