import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Simulated checkout: no payment gateway, order is created as PAID.
router.post('/', requireAuth, async (req, res) => {
  const { productId } = req.body;
  const p = await query('SELECT id FROM products WHERE id=$1', [productId]);
  if (!p.rowCount) return res.status(404).json({ error: 'Product not found' });
  const { rows } = await query(
    `INSERT INTO orders (user_id, product_id, status) VALUES ($1,$2,'PAID') RETURNING *`,
    [req.user.id, productId]
  );
  res.status(201).json(rows[0]);
});

router.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await query(
    `SELECT o.id, o.status, o.created_at, p.id AS product_id, p.name, p.price
     FROM orders o JOIN products p ON p.id=o.product_id
     WHERE o.user_id=$1 ORDER BY o.id DESC`,
    [req.user.id]
  );
  res.json(rows);
});

export default router;
