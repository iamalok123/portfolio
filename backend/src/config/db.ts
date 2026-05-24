import dns from 'node:dns'
import mongoose from 'mongoose'

// ─── Force Google DNS to bypass ISP DNS blocks on mongodb.net SRV records ────
// Reliance (and some other ISPs) block SRV DNS lookups for mongodb.net.
// This overrides Node's resolver to use Google Public DNS (8.8.8.8 / 8.8.4.4).
dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])

let isConnected = false

export function isDBConnected(): boolean {
  return isConnected
}

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI

  if (!uri) {
    throw new Error('MONGO_URI environment variable is not set')
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,   // 8s timeout instead of 30s
      connectTimeoutMS: 10000,
      family: 4, // force IPv4
    })
    isConnected = true
    console.log('✅  MongoDB connected successfully')
  } catch (err) {
    isConnected = false
    console.error('❌  MongoDB connection error:', err)
    // Don't exit — let the server run with fallback responses
    console.warn('⚠️   Server running WITHOUT database. API routes will return 503.')
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err)
    isConnected = false
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
    isConnected = false
  })

  mongoose.connection.on('reconnected', () => {
    console.log('✅  MongoDB reconnected')
    isConnected = true
  })
}
