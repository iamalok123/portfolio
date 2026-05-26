import dns from 'node:dns'
import mongoose from 'mongoose'

// ─── Force Google DNS to bypass ISP DNS blocks on mongodb.net SRV records ────
// Reliance (and some other ISPs) block SRV DNS lookups for mongodb.net.
// This overrides Node's resolver to use Google Public DNS (8.8.8.8 / 8.8.4.4).
dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])

let isConnected = false
let connectionPromise: Promise<void> | null = null
let listenersRegistered = false

export function isDBConnected(): boolean {
  return isConnected || mongoose.connection.readyState === 1
}

export function getDBState(): string {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }

  return states[mongoose.connection.readyState] ?? 'unknown'
}

export async function connectDB(): Promise<void> {
  if (isDBConnected()) {
    isConnected = true
    return
  }

  if (connectionPromise) {
    return connectionPromise
  }

  const uri = process.env.MONGO_URI

  if (!uri) {
    throw new Error('MONGO_URI environment variable is not set')
  }

  connectionPromise = (async () => {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,   // 8s timeout instead of 30s
      connectTimeoutMS: 10000,
      family: 4, // force IPv4
    })
    isConnected = true
    console.log('✅  MongoDB connected successfully')
  })()

  try {
    await connectionPromise
  } catch (err) {
    connectionPromise = null
    isConnected = false
    console.error('❌  MongoDB connection error:', err)
    // Don't exit — let the server run with fallback responses
    console.warn('⚠️   Server running WITHOUT database. API routes will return 503.')
    throw err
  } finally {
    if (!listenersRegistered) {
      listenersRegistered = true

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB runtime error:', err)
        isConnected = false
        connectionPromise = null
      })

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected')
        isConnected = false
        connectionPromise = null
      })

      mongoose.connection.on('reconnected', () => {
        console.log('✅  MongoDB reconnected')
        isConnected = true
      })
    }
  }
}

export async function ensureDBConnected(): Promise<boolean> {
  if (isDBConnected()) return true

  try {
    await connectDB()
    return isDBConnected()
  } catch {
    return false
  }
}
