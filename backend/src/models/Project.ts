import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
  title: string
  desc: string
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  image?: string
  coverImage?: string
  order: number
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    techStack: { type: [String], default: [] },
    liveUrl: { type: String },
    githubUrl: { type: String },
    image: { type: String },
    coverImage: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

ProjectSchema.pre('validate', function () {
  if (!this.coverImage && this.image) {
    this.coverImage = this.image
  }

  if (!this.image && this.coverImage) {
    this.image = this.coverImage
  }
})

export const Project = mongoose.model<IProject>('Project', ProjectSchema)
