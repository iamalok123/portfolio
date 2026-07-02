import { Router } from 'express'
import { getBlogs, getBlog, incrementViewCount } from '../controllers/blog.js'

const router = Router()

router.get('/', getBlogs)
router.get('/:slug', getBlog)
router.post('/:slug/view', incrementViewCount)

export default router
