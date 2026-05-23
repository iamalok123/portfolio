import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowUp, CalendarDays, Clock3, Hash } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { PageTransition } from '../components/layout/PageTransition'
import { BLOGS_MOCK } from '../data/blogs'
import { extractToc, slugify } from '../lib/blog'
import { api } from '../lib/axios'
import { cn } from '../lib/utils'
import type { Blog } from '../types'

function getTextFromChildren(children: unknown): string {
  if (typeof children === 'string') {
    return children
  }

  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join('')
  }

  if (children && typeof children === 'object' && 'props' in children) {
    return getTextFromChildren((children as { props?: { children?: unknown } }).props?.children)
  }

  return ''
}

function RelatedCard({ blog }: { blog: Blog }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group block rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-accent/45"
    >
      <div className="aspect-video rounded-md bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_48%),var(--surface-2)]" />
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-accent">{blog.category}</p>
      <h3 className="mt-2 font-display text-xl font-extrabold leading-tight text-foreground transition group-hover:text-accent">
        {blog.title}
      </h3>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-muted">
        {blog.readTime} min read
      </p>
    </Link>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState<Blog | null>(
    () => BLOGS_MOCK.find((blog) => blog.slug === slug) ?? null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [activeHeading, setActiveHeading] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { scrollYProgress } = useScroll()
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    let isActive = true

    api
      .get<Blog>(`/blogs/${slug}`)
      .then((response) => {
        if (isActive && response.data?._id) {
          setPost(response.data)
        }
      })
      .catch(() => {
        if (isActive) {
          setPost(BLOGS_MOCK.find((blog) => blog.slug === slug) ?? null)
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [slug])

  const toc = useMemo(() => (post ? extractToc(post.content) : []), [post])

  useEffect(() => {
    if (!toc.length) {
      return
    }

    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) {
          setActiveHeading(visible.target.id)
        }
      },
      { rootMargin: '-30% 0px -58% 0px', threshold: [0.1, 0.4, 0.7] },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [toc])

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const components: Components = {
    h2: ({ children, ...props }) => {
      const text = getTextFromChildren(children)
      const id = slugify(text)

      return (
        <h2 id={id} {...props}>
          <a href={`#${id}`} aria-label={`Link to ${text}`}>
            <Hash size={20} />
          </a>
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }) => {
      const text = getTextFromChildren(children)
      const id = slugify(text)

      return (
        <h3 id={id} {...props}>
          <a href={`#${id}`} aria-label={`Link to ${text}`}>
            <Hash size={17} />
          </a>
          {children}
        </h3>
      )
    },
    a: ({ children, ...props }) => (
      <a target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    ),
    img: ({ ...props }) => <img loading="lazy" {...props} />,
  }

  const relatedPosts = useMemo(() => {
    if (!post) {
      return []
    }

    return BLOGS_MOCK.filter((blog) => blog.slug !== post.slug && blog.category === post.category).slice(
      0,
      3,
    )
  }, [post])

  if (isLoading && !post) {
    return (
      <PageTransition>
        <div className="mx-auto min-h-svh w-full max-w-5xl px-6 pb-24 pt-32 sm:px-8 lg:px-10">
          <div className="h-8 w-32 animate-pulse rounded bg-surface-2" />
          <div className="mt-8 aspect-video animate-pulse rounded-lg bg-surface-2" />
          <div className="mt-8 h-12 w-4/5 animate-pulse rounded bg-surface-2" />
        </div>
      </PageTransition>
    )
  }

  if (!post) {
    return (
      <PageTransition>
        <section className="grid min-h-svh place-items-center px-6 text-center">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-accent">
              Post not found
            </p>
            <h1 className="mt-4 font-display text-5xl font-extrabold text-foreground">
              This article is not available.
            </h1>
            <Link
              to="/blog"
              className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-black"
            >
              Back to Blog
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed left-0 top-0 z-[70] h-1 w-full origin-left bg-accent"
      />

      <article className="mx-auto min-h-svh w-full max-w-7xl px-6 pb-24 pt-32 sm:px-8 lg:px-10">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-foreground"
          to="/blog"
        >
          <ArrowLeft size={17} />
          All Posts
        </Link>

        <div className="mt-8 aspect-video overflow-hidden rounded-lg border border-border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_25%,transparent),transparent_48%),radial-gradient(circle_at_78%_22%,color-mix(in_srgb,var(--foreground)_14%,transparent),transparent_18rem),var(--surface-2)]" />

        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-muted">
          <span className="rounded-full bg-accent px-3 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.16em] text-black">
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} />
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} />
            {post.readTime} min read
          </span>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/blog?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border border-border px-3 py-1 transition hover:border-accent hover:text-foreground"
            >
              {tag}
            </Link>
          ))}
        </div>

        <h1 className="mt-6 max-w-5xl font-display text-5xl font-extrabold leading-[0.98] text-foreground sm:text-7xl">
          {post.title}
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="prose prose-portfolio max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeHighlight]}
              components={components}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-lg border border-border bg-surface p-5">
              <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-muted">
                Table of Contents
              </p>
              <nav className="mt-4 space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      'block border-l border-border py-1.5 pr-2 text-sm text-muted transition hover:border-accent hover:text-foreground',
                      item.level === 3 ? 'pl-6' : 'pl-3',
                      activeHeading === item.id && 'border-accent text-accent',
                    )}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>

        {relatedPosts.length > 0 ? (
          <section className="mt-20 border-t border-border pt-12">
            <h2 className="font-display text-3xl font-extrabold text-foreground">Related Posts</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {relatedPosts.map((related) => (
                <RelatedCard key={related._id} blog={related} />
              ))}
            </div>
          </section>
        ) : null}
      </article>

      {showBackToTop ? (
        <motion.button
          type="button"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full bg-accent text-black shadow-xl"
        >
          <ArrowUp size={20} />
        </motion.button>
      ) : null}
    </PageTransition>
  )
}
