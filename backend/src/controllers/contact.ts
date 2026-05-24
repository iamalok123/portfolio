import type { Request, Response, NextFunction } from 'express'
import nodemailer from 'nodemailer'
import { Message } from '../models/Message.js'
import { isDBConnected } from '../config/db.js'

// ─── POST /api/contact ────────────────────────────────────────────────────────
export async function sendMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, subject, message } = req.body as {
      name?: unknown
      email?: unknown
      subject?: unknown
      message?: unknown
    }

    // Basic validation
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string'
    ) {
      res.status(400).json({ success: false, message: 'All fields are required' })
      return
    }

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedMessage = message.trim()

    if (trimmedName.length < 2) {
      res.status(400).json({ success: false, message: 'Name must be at least 2 characters' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      res.status(400).json({ success: false, message: 'Invalid email address' })
      return
    }
    if (!['Internship', 'Project', 'Freelance', 'Other'].includes(subject)) {
      res.status(400).json({ success: false, message: 'Invalid subject' })
      return
    }
    if (trimmedMessage.length < 20) {
      res.status(400).json({ success: false, message: 'Message must be at least 20 characters' })
      return
    }

    // Save to MongoDB (if connected)
    let messageId: unknown = undefined
    if (isDBConnected()) {
      const savedMessage = await Message.create({
        name: trimmedName,
        email: trimmedEmail,
        subject,
        message: trimmedMessage,
      })
      messageId = savedMessage._id
    } else {
      console.warn('⚠️  DB unavailable — message not persisted, email only')
    }

    // Send email notification (non-blocking)
    sendEmailNotification({
      name: trimmedName,
      email: trimmedEmail,
      subject,
      message: trimmedMessage,
    }).catch((err) => {
      console.error('Email send failed (non-fatal):', err)
    })

    const responseData: any = {
      success: true,
      message: "Message received! I'll get back to you soon.",
    }
    
    if (messageId) {
        responseData.id = messageId;
    }

    res.status(201).json(responseData)
  } catch (err) {
    next(err)
  }
}

// ─── Email Helper ─────────────────────────────────────────────────────────────
async function sendEmailNotification(data: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (!adminEmail || !smtpHost || !smtpUser || !smtpPass) {
    console.warn('⚠️  Email env vars not configured — skipping email notification')
    return
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort ? parseInt(smtpPort, 10) : 587,
    secure: smtpPort === '465',
    auth: { user: smtpUser, pass: smtpPass },
  })

  await transporter.sendMail({
    from: `"Portfolio Contact" <${smtpUser}>`,
    to: adminEmail,
    replyTo: data.email,
    subject: `[Portfolio] New message: ${data.subject} from ${data.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #0d0d0d; margin-bottom: 8px;">New Portfolio Message</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">Received via alok.dev contact form</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 100px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Subject</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${data.subject}</td>
          </tr>
        </table>

        <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Message</p>
          <p style="margin: 0; white-space: pre-line;">${data.message}</p>
        </div>

        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
          Reply directly to this email to respond to ${data.name}.
        </p>
      </div>
    `,
  })
}
