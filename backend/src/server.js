import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';

const app = express();
const configuredOrigins = (process.env.CLIENT_URL || '*').split(',').map((origin) => origin.trim()).filter(Boolean);
const clientOrigins = configuredOrigins.length === 1 && configuredOrigins[0] === '*'
  ? '*'
  : [...new Set([...configuredOrigins, 'https://code-giils-web-9tk4.onrender.com'])];
app.use(cors({ origin: clientOrigins.length === 1 && clientOrigins[0] === '*' ? '*' : clientOrigins }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Server error' });
});

const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => console.log(`API running on http://${host}:${port}`));
