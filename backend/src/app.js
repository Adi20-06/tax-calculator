import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './config/db.js';
import taxRoutes from './routes/taxRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { optionalAuth } from './middleware/auth.js';
import { generalLimiter, authLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// If deployed behind a reverse proxy (Render, Railway, Nginx, etc.),
// this makes req.ip reflect the real client IP for rate limiting.
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Restrict CORS to your actual frontend origin(s) — never use '*' for an app with auth
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Cap request body size — prevents oversized payload abuse
app.use(express.json({ limit: '50kb' }));

// General rate limiting on all API routes
app.use('/api', generalLimiter);

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'error' });
  }
});

// Auth routes get their own stricter limiter (brute-force protection)
app.use('/api/auth', authLimiter, authRoutes);

app.use('/api', optionalAuth, taxRoutes);
app.use('/api/profiles', optionalAuth, profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});