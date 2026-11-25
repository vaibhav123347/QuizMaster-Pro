import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';
import { apiLimiter } from './middleware/rateLimitMiddleware';
import { sanitizeRequest } from './middleware/validateMiddleware';
import apiRoutes from './routes';
import { AppError } from './utils/AppError';

const app = express();

// Trust first proxy (required for Render / reverse proxy rate limiting)
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests or non-browser tools with no origin header
      if (!origin) {
        return callback(null, true);
      }
      if (env.clientUrls.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new AppError(`CORS blocked request from origin: ${origin}`, 403, 'CORS_BLOCKED')
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(sanitizeRequest);
app.use('/api', apiLimiter);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'QuizMaster Pro API Server',
    health: '/api/health',
  });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
