import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import categoriesRoutes from './routes/categories.js';
import menuRoutes from './routes/menu.js';
import specialsRoutes from './routes/specials.js';
import ordersRoutes from './routes/orders.js';
import loyaltyRoutes from './routes/loyalty.js';
import leadsRoutes from './routes/leads.js';
import campaignsRoutes from './routes/campaigns.js';
import feedbackRoutes from './routes/feedback.js';
import galleryRoutes from './routes/gallery.js';
import qrcodeRoutes from './routes/qrcode.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in local development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    brand: 'VINTAGE KRUFFLES',
    location: 'RK Beach, Visakhapatnam',
    time: new Date().toISOString()
  });
});

// Mount modular API routers
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/specials', specialsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/qrcode', qrcodeRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error occurred.',
    message: err.message || 'Unknown error'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🧇 VINTAGE KRUFFLES backend server running on http://localhost:${PORT}`);
  console.log(`📍 Serving dessert lovers at RK Beach, Vizag`);
});

export default app;
