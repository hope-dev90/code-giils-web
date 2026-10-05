import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireAdmin);

// ── Stats overview ──────────────────────────────────────────────────────────
router.get('/stats', async (_req, res, next) => {
  try {
    const [users, products, orders, revenue] = await Promise.all([
      query('SELECT COUNT(*) AS count FROM users'),
      query('SELECT COUNT(*) AS count FROM products'),
      query("SELECT COUNT(*) AS count FROM orders"),
      query("SELECT COALESCE(SUM(p.price),0) AS total FROM orders o JOIN products p ON p.id=o.product_id WHERE o.status NOT IN ('CANCELLED')"),
    ]);
    const [pending, paid, shipped, delivered, cancelled] = await Promise.all([
      query("SELECT COUNT(*) AS count FROM orders WHERE status='PENDING'"),
      query("SELECT COUNT(*) AS count FROM orders WHERE status='PAID'"),
      query("SELECT COUNT(*) AS count FROM orders WHERE status='SHIPPED'"),
      query("SELECT COUNT(*) AS count FROM orders WHERE status='DELIVERED'"),
      query("SELECT COUNT(*) AS count FROM orders WHERE status='CANCELLED'"),
    ]);
    res.json({
      users: Number(users.rows[0].count),
      products: Number(products.rows[0].count),
      orders: Number(orders.rows[0].count),
      revenue: Number(revenue.rows[0].total),
      ordersByStatus: {
        PENDING: Number(pending.rows[0].count),
        PAID: Number(paid.rows[0].count),
        SHIPPED: Number(shipped.rows[0].count),
        DELIVERED: Number(delivered.rows[0].count),
        CANCELLED: Number(cancelled.rows[0].count),
      },
    });
  } catch (err) { next(err); }
});

// ── Users ────────────────────────────────────────────────────────────────────
router.get('/users', async (_req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const allowed = ['USER', 'ADMIN'];
    if (!allowed.includes(req.body.role))
      return res.status(400).json({ error: 'Role must be USER or ADMIN' });
    // Prevent removing the last admin
    if (req.body.role === 'USER') {
      const { rows } = await query(
        "SELECT COUNT(*) AS count FROM users WHERE role='ADMIN' AND id!=$1",
        [req.params.id]
      );
      if (Number(rows[0].count) === 0)
        return res.status(400).json({ error: 'Cannot demote the last admin.' });
    }
    const { rows } = await query(
      'UPDATE users SET role=$1 WHERE id=$2 RETURNING id,name,email,role,created_at',
      [req.body.role, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    if (String(req.user.id) === String(req.params.id))
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    const r = await query('DELETE FROM users WHERE id=$1', [req.params.id]);
    if (!r.rowCount) return res.status(404).json({ error: 'User not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Products ─────────────────────────────────────────────────────────────────
router.get('/products', async (_req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/products', async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.name || !b.description || !b.cultural_story || Number(b.price) < 0)
      return res.status(400).json({ error: 'name, description, price and cultural_story are required' });
    const { rows } = await query(
      `INSERT INTO products (name,description,price,image,cultural_story)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [b.name, b.description, Number(b.price), b.image || null, b.cultural_story]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.name || !b.description || !b.cultural_story || Number(b.price) < 0)
      return res.status(400).json({ error: 'name, description, price and cultural_story are required' });
    const { rows } = await query(
      `UPDATE products SET name=$1,description=$2,price=$3,image=$4,cultural_story=$5 WHERE id=$6 RETURNING *`,
      [b.name, b.description, Number(b.price), b.image || null, b.cultural_story, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    const r = await query('DELETE FROM products WHERE id=$1', [req.params.id]);
    if (!r.rowCount) return res.status(404).json({ error: 'Product not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Orders ───────────────────────────────────────────────────────────────────
router.get('/orders', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT o.id, o.status, o.created_at,
              u.id AS user_id, u.name AS user_name, u.email,
              p.id AS product_id, p.name AS product_name, p.price
       FROM orders o
       JOIN users u ON u.id = o.user_id
       JOIN products p ON p.id = o.product_id
       ORDER BY o.id DESC`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.patch('/orders/:id', async (req, res, next) => {
  try {
    const allowed = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!allowed.includes(req.body.status))
      return res.status(400).json({ error: 'Invalid status' });
    const { rows } = await query(
      'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
      [req.body.status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

export default router;
