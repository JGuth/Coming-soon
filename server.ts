import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { dbManager } from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Initialize database
dbManager.init();

// Basic security headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// JSON body parser with tight limits
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

// Simple in-memory rate limiting for abuse prevention
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 10;

function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || 'pipeband_salt_2026';
  return crypto.createHmac('sha256', salt).update(ip).digest('hex').slice(0, 16);
}

function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const hashedIp = hashIp(ip);
  const now = Date.now();

  const record = rateLimitMap.get(hashedIp);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(hashedIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a few minutes before trying again.',
    });
    return;
  }

  record.count += 1;
  next();
}

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Health check endpoint (used by Docker, load balancers, monitoring)
app.get('/api/health', (_req: Request, res: Response) => {
  const dbHealthy = dbManager.checkHealth();
  const status = dbHealthy ? 'ok' : 'degraded';
  res.status(dbHealthy ? 200 : 500).json({
    status,
    timestamp: new Date().toISOString(),
    service: 'PipeBand.app API',
    database: dbHealthy ? 'connected' : 'error',
    uptime: process.uptime(),
  });
});

// Launch-list signup endpoint
app.post('/api/signup', rateLimiter, (req: Request, res: Response) => {
  try {
    const { email, honeypot, interest, consent } = req.body;

    // Honeypot anti-spam check
    if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
      // Silently respond with success to fool spambots
      res.status(200).json({
        success: true,
        message: 'Thank you for joining the launch list.',
      });
      return;
    }

    if (!email || typeof email !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
      return;
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail.length > 254) {
      res.status(400).json({
        success: false,
        error: 'Email address exceeds maximum length.',
      });
      return;
    }

    // RFC 5322 compliant email regex check
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmedEmail)) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid email address format (e.g. piper@example.com).',
      });
      return;
    }

    const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const ipHash = hashIp(clientIp);

    const result = dbManager.insertSignup(
      trimmedEmail,
      consent !== false,
      typeof interest === 'string' ? interest.slice(0, 50) : 'general',
      ipHash
    );

    res.status(200).json({
      success: true,
      isNew: result.isNew,
      message: result.message,
    });
  } catch (err: unknown) {
    console.error('Signup error:', err);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while saving your signup. Please try again shortly.',
    });
  }
});

// Setup dev or production static serving
async function startServer() {
  if (!isProd) {
    // In development: use Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // In production: serve static build files
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.warn('Production build dist/ not found. Run npm run build first.');
    }
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PipeBand.app] Server listening on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('[PipeBand.app] Graceful shutdown initiated...');
    server.close(() => {
      dbManager.close();
      console.log('[PipeBand.app] Database closed, process exiting.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
