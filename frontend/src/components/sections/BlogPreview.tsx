import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { getBlogExcerpt } from '../../lib/blog'
import { resolveAssetUrl } from '../../lib/assets'
import { api } from '../../lib/axios'
import type { Blog } from '../../types'
import { BlogCoverArt } from '../ui/BlogCoverArt'

const MotionLink = motion(Link)

export function BlogPreview() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })
  const [previewBlogs, setPreviewBlogs] = useState<Blog[]>([])

  useEffect(() => {
    let isActive = true

    api
      .get<Blog[] | { success: boolean; data: Blog[] }>('/blogs')
      .then((response) => {
        const posts = Array.isArray(response.data) ? response.data : response.data.data

        if (isActive && Array.isArray(posts)) {
          setPreviewBlogs(posts.slice(0, 3))
        }
      })
      .catch(() => {
        if (isActive) {
          setPreviewBlogs([])
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  return (
    <section id="blog" ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-muted">
              // Writings
            </p>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.06] text-foreground sm:text-6xl">
              Thoughts & Build Notes.
            </h2>
          </div>
          <MotionLink
            to="/blogs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
            className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.16em]"
          >
            Read All Posts
            <ArrowUpRight size={17} />
          </MotionLink>
        </div>

        <motion.div
          className="mt-12 grid gap-5 md:grid-cols-3"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
            hidden: {},
          }}
        >
          {previewBlogs.map((blog) => (
            <motion.article
              key={blog._id}
              variants={{
                hidden: { opacity: 0, y: 26 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 22 }}
              className="group flex h-full overflow-hidden rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-foreground/30"
            >
              <Link to={`/blog/${blog.slug}`} className="flex min-h-full w-full flex-col">
                <BlogCoverArt
                  title={blog.title}
                  imageSrc={resolveAssetUrl(blog.coverImage || blog.image)}
                  compact
                  className="rounded-md"
                />
                <div className="flex flex-1 flex-col pt-5">
                  <h3 className="font-display text-2xl font-bold leading-tight text-foreground transition group-hover:text-muted">
                    {blog.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
                    {getBlogExcerpt(blog)}
                  </p>
                  <div className="mt-auto pt-6">
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 pl-1 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={14} />
                        {blog.readTime} min
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <MotionLink
            to="/blogs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.16em]"
          >
            Read More
            <ArrowUpRight size={17} />
          </MotionLink>
        </div>
      </div>
    </section>
  )
}
