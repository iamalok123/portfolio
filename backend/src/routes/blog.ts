import { Router } from 'express'
import { getBlogs, getBlog } from '../controllers/blog.js'

const router = Router()

router.get('/', getBlogs)
router.get('/:slug', getBlog)

export default router
