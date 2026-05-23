import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { BLOGS_MOCK } from '../../data/blogs'
import { getBlogExcerpt } from '../../lib/blog'

export function BlogPreview() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })
  const featuredBlogs = BLOGS_MOCK.filter((blog) => blog.featured).slice(0, 3)

  return (
    <section id="blog" ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-accent">
              // writings
            </p>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-foreground sm:text-6xl">
              Thoughts & Build Notes.
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/60 px-5 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-foreground transition hover:bg-accent hover:text-black"
          >
            Read All Posts
            <ArrowUpRight size={17} />
          </Link>
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
          {featuredBlogs.map((blog) => (
            <motion.article
              key={blog._id}
              variants={{
                hidden: { opacity: 0, y: 26 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 22 }}
              className="group overflow-hidden rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-accent/45"
            >
              <Link to={`/blog/${blog.slug}`}>
                <div className="aspect-video rounded-md bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_26%,transparent),transparent_48%),radial-gradient(circle_at_72%_22%,color-mix(in_srgb,var(--foreground)_14%,transparent),transparent_14rem),var(--surface-2)]" />
                <div className="pt-5">
                  <span className="rounded-full bg-accent px-3 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.16em] text-black">
                    {blog.category}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-extrabold leading-tight text-foreground transition group-hover:text-accent">
                    {blog.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
                    {getBlogExcerpt(blog)}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-[0.14em] text-muted">
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
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
