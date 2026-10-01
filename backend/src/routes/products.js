import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const { rows } = await query('SELECT * FROM products ORDER BY id DESC');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await query('SELECT * FROM products WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
  res.json(rows[0]);
});

const valid = (b) => b.name && b.description && b.cultural_story && Number(b.price) >= 0;

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const b = req.body;
  if (!valid(b)) return res.status(400).json({ error: 'name, description, price and cultural_story are required' });
  const { rows } = await query(
    `INSERT INTO products (name,description,price,image,cultural_story) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [b.name, b.description, b.price, b.image || null, b.cultural_story]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const b = req.body;
  if (!valid(b)) return res.status(400).json({ error: 'name, description, price and cultural_story are required' });
  const { rows } = await query(
    `UPDATE products SET name=$1, description=$2, price=$3, image=$4, cultural_story=$5 WHERE id=$6 RETURNING *`,
    [b.name, b.description, b.price, b.image || null, b.cultural_story, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
  res.json(rows[0]);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const r = await query('DELETE FROM products WHERE id=$1', [req.params.id]);
  if (!r.rowCount) return res.status(404).json({ error: 'Product not found' });
  res.json({ ok: true });
});

export default router;
