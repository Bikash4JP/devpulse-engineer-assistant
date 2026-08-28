import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import integrationsRoutes from './routes/integrations.routes';
import systemRoutes from './routes/system.routes';
import { openApiSpec } from './docs/openapi';
import { requestLogger } from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// 1. RATE LIMITING MIDDLEWARE (DDoS & Brute-Force Shield)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again after 15 minutes.',
  },
});

app.use(limiter);

// 2. STRUCTURED REQUEST LOGGER
app.use(requestLogger);

// 3. SECURITY SHIELD (Helmet)
app.use(helmet({ contentSecurityPolicy: false }));

// 4. CROSS-ORIGIN RESOURCE SHARING (CORS)
app.use(cors());

// 5. BODY PARSER (Payload Size Limited to 10kb to prevent Memory Overload Attacks)
app.use(express.json({ limit: '10kb' }));

// 6. ROUTE MOUNTING
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/integrations', integrationsRoutes);
app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/summary', require('../routes/summary.routes').default);

// 7. VISUAL OPENAPI / SWAGGER SPECS ENDPOINT
app.get('/api/v1/docs', (req: Request, res: Response) => {
  res.status(200).json(openApiSpec);
});

// 8. HEALTH CHECK ROUTE
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'DevPulse Backend API is running smoothly!',
    timestamp: new Date().toISOString(),
  });
});

// 9. CENTRALIZED PRODUCTION ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

export default app;
