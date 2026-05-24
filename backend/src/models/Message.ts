import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: {
      type: String,
      required: true,
      enum: ['Internship', 'Project', 'Freelance', 'Other'],
    },
    message: { type: String, required: true, trim: true, minlength: 20 },
  },
  { timestamps: true },
)

export const Message = mongoose.model<IMessage>('Message', MessageSchema)
