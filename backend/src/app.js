import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import geocodeRoutes from './routes/geocodeRoutes.js';
import advisorRoutes from './routes/advisorRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Configurable allowed origins via FRONTEND_URL or CORS_ORIGIN
  const configuredOrigins = (process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, server-to-server, mobile apps, health checks)
        if (!origin) return callback(null, true);

        // If specific origins are configured in environment
        if (configuredOrigins.length > 0) {
          if (configuredOrigins.includes(origin) || configuredOrigins.includes('*')) {
            return callback(null, true);
          }
          // In development, also allow localhost/127.0.0.1
          if (
            process.env.NODE_ENV !== 'production' &&
            (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))
          ) {
            return callback(null, true);
          }
          return callback(null, false);
        }

        // When no specific FRONTEND_URL is set:
        // In development, allow localhost and 127.0.0.1 on any port
        if (
          process.env.NODE_ENV !== 'production' ||
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:')
        ) {
          return callback(null, true);
        }

        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));

  // Unauthenticated health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'pravirak-backend', time: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/businesses', businessRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/schemes', schemeRoutes);
  app.use('/api/geocode', geocodeRoutes);
  app.use('/api/advisor', advisorRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
