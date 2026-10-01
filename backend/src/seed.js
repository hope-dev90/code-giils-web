import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { pool, query } from './db.js';

const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', 10);
await query(
  `INSERT INTO users (name, email, password, role, email_verified_at) VALUES ($1,$2,$3,'ADMIN',NOW())
   ON CONFLICT (email) DO UPDATE SET role='ADMIN'`,
  ['Admin', process.env.ADMIN_EMAIL || 'admin@umuco.rw', hash]
);

const { rows } = await query('SELECT COUNT(*)::int AS n FROM products');
if (rows[0].n === 0) {
  const items = [
    ['Agaseke Peace Basket', 'Hand-woven sisal and sweetgrass basket with a pointed lid.', 45,
     'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
     'The agaseke is woven by Rwandan women and was traditionally given as a gift symbolising peace and hospitality. Today, cooperatives weave them to support families.'],
    ['Imigongo Wall Art', 'Geometric art made from cow-dung paint in black, white and red.', 80,
     'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800',
     'Imigongo originated in eastern Rwanda in the 18th century. Its bold spiral patterns are a living art form passed down through generations of artisans.'],
    ['Intore Drum', 'Carved wooden drum inspired by the royal drummers of Rwanda.', 120,
     'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
     'Drums were sacred in the Rwandan kingdom and central to ceremonies and dance. This piece honours that rhythm and heritage.']
  ];
  for (const p of items)
    await query('INSERT INTO products (name, description, price, image, cultural_story) VALUES ($1,$2,$3,$4,$5)', p);
}
console.log('Seed complete. Admin:', process.env.ADMIN_EMAIL || 'admin@umuco.rw');
await pool.end();
