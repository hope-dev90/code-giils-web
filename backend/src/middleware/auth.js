import jwt from 'jsonwebtoken';
import { query } from '../db.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  if (!process.env.JWT_SECRET) return res.status(503).json({ error: 'Authentication is not configured.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await query('SELECT id,name,email,role FROM users WHERE id=$1 AND email_verified_at IS NOT NULL', [payload.sub]);
    if (!rows[0]) return res.status(401).json({ error: 'Invalid or expired session' });
    req.user = rows[0];
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Invalid or expired session' });
    return next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access only' });
  next();
}
