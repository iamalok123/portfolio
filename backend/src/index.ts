import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectDB, getDBState, isDBConnected } from './config/db.js'
import blogRoutes from './routes/blog.js'
import projectRoutes from './routes/project.js'
import contactRoutes from './routes/contact.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetDir = path.resolve(__dirname, '../../assets')

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet())

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

const vercelPortfolioPreviewPattern = /^https:\/\/portfolio-[a-z0-9-]+\.vercel\.app$/i

function isAllowedOrigin(origin: string): boolean {
  const normalizedOrigin = origin.replace(/\/$/, '')
  return allowedOrigins.includes(normalizedOrigin) || vercelPortfolioPreviewPattern.test(normalizedOrigin)
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`))
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// ─── Seeded media assets ─────────────────────────────────────────────────────
app.use(
  ['/assets', '/asset'],
  express.static(assetDir, {
    maxAge: '7d',
    immutable: true,
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    },
  }),
)

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    success: true,
    service: 'Portfolio API',
    status: 'ok',
    endpoints: {
      health: '/health',
      blogs: '/api/blogs',
      projects: '/api/projects',
      contact: '/api/contact',
    },
  })
})

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: {
      connected: isDBConnected(),
      state: getDBState(),
    },
    timestamp: new Date().toISOString(),
  })
})

app.get(['/favicon.ico', '/favicon.png'], (_req, res) => {
  res.status(204).end()
})

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/blogs', blogRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/contact', contactRoutes)

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler)

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 5000)

if (!process.env.VERCEL) {
  // Start HTTP server locally. Vercel imports the Express app as a function.
  app.listen(PORT, () => {
    console.log(`🚀  Portfolio API running on http://localhost:${PORT}`)
    console.log(`📌  Environment: ${process.env.NODE_ENV ?? 'development'}`)
  })
}

// Connect to MongoDB in background — server stays up even if DB is down
connectDB().catch((err) => {
  console.error('Unhandled DB error:', err)
})

export default app
