import type { Request, Response, NextFunction } from 'express'
import { Project } from '../models/Project.js'
import { ensureDBConnected } from '../config/db.js'

// ─── GET /api/projects ────────────────────────────────────────────────────────
export async function getProjects(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!(await ensureDBConnected())) {
    res.status(503).json({ success: false, message: 'Database unavailable', data: [] })
    return
  }

  try {
    const projects = await Project.find().sort({ order: 1 }).lean()
    res.json({ success: true, data: projects })
  } catch (err) {
    next(err)
  }
}
