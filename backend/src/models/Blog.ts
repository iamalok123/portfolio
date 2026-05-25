import mongoose, { Document, Schema } from 'mongoose'

export interface IBlog extends Document {
  title: string
  slug: string
  content: string
  tags: string[]
  category: string
  readTime: number
  publishedAt: Date
  image?: string
  coverImage?: string
}

/** Simple slug generator — converts "My Blog Post" → "my-blog-post" */
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // remove non-word chars
    .replace(/[\s_-]+/g, '-')  // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '')   // strip leading/trailing hyphens
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
    readTime: { type: Number, required: true, min: 1 },
    publishedAt: { type: Date, default: Date.now },
    image: { type: String },
    coverImage: { type: String },
  },
  { timestamps: true },
)

// Auto-generate slug from title unless seed/content explicitly provides one.
BlogSchema.pre('validate', async function () {
  if (!this.coverImage && this.image) {
    this.coverImage = this.image
  }

  if (!this.image && this.coverImage) {
    this.image = this.coverImage
  }

  if (this.isNew || this.isModified('title')) {
    const baseSlug = toSlug((this.slug || this.title) as string)
    let slug = baseSlug
    let count = 0
    // Ensure uniqueness — can't reference Blog here as it's not yet defined,
    // so we use the model registry
    try {
      const BlogModel = mongoose.model('Blog')
      while (await BlogModel.findOne({ slug, _id: { $ne: this._id } }).lean()) {
        count++
        slug = `${baseSlug}-${count}`
      }
    } catch {
      // Model not registered yet on first call — skip uniqueness check
    }
    this.slug = slug
  }
})

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema)
