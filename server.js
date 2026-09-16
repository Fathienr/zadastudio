import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Health check endpoint for container probes and warmups
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Disable caching for development environment
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Serve static assets with automatic .html extension resolution
app.use(express.static(__dirname, {
  extensions: ['html', 'htm'],
  maxAge: 0
}));

// Explicit HTML page routes
const pages = [
  'index',
  'studio',
  'photobooth',
  'yearbook',
  'school',
  'progress',
  'admin-login',
  'admin-dashboard',
  'admin-invoice'
];

pages.forEach((page) => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, `${page}.html`));
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for client-side navigation
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    next();
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  console.log(`➜  Local:   http://localhost:${PORT}/`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});
