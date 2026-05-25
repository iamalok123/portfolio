import type { Request, Response, NextFunction } from 'express'
import { Blog } from '../models/Blog.js'
import { isDBConnected } from '../config/db.js'

// ─── GET /api/blogs ───────────────────────────────────────────────────────────
export async function getBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!isDBConnected()) {
    res.status(503).json({ success: false, message: 'Database unavailable', data: [] })
    return
  }

  try {
    const { tag, category, q, sort } = req.query as Record<string, string | undefined>

    const filter: Record<string, unknown> = {}
    if (tag) filter['tags'] = { $in: [tag] }
    if (category) filter['category'] = { $regex: new RegExp(category, 'i') }
    if (q) {
      filter['$or'] = [
        { title: { $regex: new RegExp(q, 'i') } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ]
    }

    let sortOption: Record<string, 1 | -1> = { publishedAt: -1 }
    if (sort === 'oldest') sortOption = { publishedAt: 1 }
    if (sort === 'readTime') sortOption = { readTime: 1 }

    const blogs = await Blog.find(filter).sort(sortOption).lean()
    res.json({ success: true, data: blogs })
  } catch (err) {
    next(err)
  }
}

// ─── GET /api/blogs/:slug ─────────────────────────────────────────────────────
export async function getBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!isDBConnected()) {
    res.status(503).json({ success: false, message: 'Database unavailable' })
    return
  }

  try {
    const { slug } = req.params
    const blog = await Blog.findOne({ slug }).lean()

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found' })
      return
    }

    res.json({ success: true, data: blog })
  } catch (err) {
    next(err)
  }
}
