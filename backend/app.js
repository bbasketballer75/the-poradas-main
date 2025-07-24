import express from 'express';
import compression from 'compression';
import path from 'path';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { specs, swaggerUi } from './config/swagger.js';
import winston from 'winston';
import xss from 'xss';

// Import routes
import guestbookRoutes from './routes/guestbookRoutes.js';
import albumRoutes from './routes/album.js';
import videoRoutes from './routes/videoRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();
// Enable gzip compression for all responses
app.use(compression());

// Response time monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    };
    
    // Log slow requests (>1000ms) as warnings
    if (duration > 1000) {
      logger.warn('Slow request detected', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
  
  next();
});

// Centralized logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.ip-api.com", "https://maps.googleapis.com"],
    },
  },
}));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb',
  verify: (req, res, buf) => {
    // Sanitize all incoming JSON
    req.body = JSON.parse(xss(buf.toString()));
  }
}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Trust the first proxy hop (important for getting the correct IP in production on services like Cloud Run)
app.set('trust proxy', 1);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// The project root is one level up from the 'backend' directory
const rootDir = path.join(__dirname, '..');
// Serve static assets with long cache headers
const oneYear = 1000 * 60 * 60 * 24 * 365;
app.use('/uploads', express.static(path.join(rootDir, 'uploads'), {
  maxAge: oneYear,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));
app.use('/public', express.static(path.join(rootDir, 'public'), {
  maxAge: oneYear,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Wedding Site API Documentation',
}));

// Mount routers
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/album', albumRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/upload', uploadRoutes);

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply the rate limiting middleware to all API requests
app.use('/api', limiter);

// Use custom error handler
app.use(errorHandler);

export default app;
