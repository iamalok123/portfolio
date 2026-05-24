import type { Request, Response, NextFunction } from 'express'
import { Project } from '../models/Project.js'
import { isDBConnected } from '../config/db.js'

// ─── GET /api/projects ────────────────────────────────────────────────────────
export async function getProjects(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!isDBConnected()) {
    res.status(503).json({ success: false, message: 'Database unavailable', data: [] })
    return
  }

  try {
    const { tech, featured } = req.query as Record<string, string | undefined>

    const filter: Record<string, unknown> = {}
    if (tech) filter['techStack'] = { $in: [new RegExp(tech, 'i')] }
    if (featured === 'true') filter['featured'] = true

    const projects = await Project.find(filter).sort({ order: 1 }).lean()
    res.json({ success: true, data: projects })
  } catch (err) {
    next(err)
  }
}
