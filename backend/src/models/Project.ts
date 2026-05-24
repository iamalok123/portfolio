import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
  title: string
  desc: string
  tags: string[]
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  coverImage?: string
  featured: boolean
  order: number
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    liveUrl: { type: String },
    githubUrl: { type: String },
    coverImage: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Project = mongoose.model<IProject>('Project', ProjectSchema)
