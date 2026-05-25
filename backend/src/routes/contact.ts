import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { sendMessage } from '../controllers/contact.js'

// Rate limit: max 20 requests per 15 minutes per IP for contact endpoint
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 messages can be sent in 15 minute
  message: {
    success: false,
    message: 'Too many messages sent. Please wait 15 minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const router = Router()

router.post('/', contactLimiter, sendMessage)

export default router
