import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

// Import routes
import guestbookRoutes from './routes/guestbookRoutes.js';
import albumRoutes from './routes/album.js';
import videoRoutes from './routes/videoRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust the first proxy hop (important for getting the correct IP in production on services like Cloud Run)
app.set('trust proxy', 1);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// The project root is one level up from the 'backend' directory
const rootDir = path.join(__dirname, '..');
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/public', express.static(path.join(rootDir, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// Mount routers
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/album', albumRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/map', mapRoutes);

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
