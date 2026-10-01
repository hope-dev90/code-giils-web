import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireAdmin);

router.get('/users', async (_req, res) => {
  const { rows } = await query('SELECT id,name,email,role,created_at FROM users ORDER BY id DESC');
  res.json(rows);
});

router.get('/orders', async (_req, res) => {
  const { rows } = await query(
    `SELECT o.id, o.status, o.created_at, u.name AS user_name, u.email, p.name AS product_name, p.price
     FROM orders o JOIN users u ON u.id=o.user_id JOIN products p ON p.id=o.product_id
     ORDER BY o.id DESC`
  );
  res.json(rows);
});

router.patch('/orders/:id', async (req, res) => {
  const allowed = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status' });
  const { rows } = await query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [req.body.status, req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Order not found' });
  res.json(rows[0]);
});

export default router;
