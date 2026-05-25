import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowUp, CalendarDays, Check, Clock3, Copy, Hash } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { PageTransition } from '../components/layout/PageTransition'
import { BlogCoverArt } from '../components/ui/BlogCoverArt'
import { BLOGS_MOCK } from '../data/blogs'
import { extractToc, slugify } from '../lib/blog'
import { api } from '../lib/axios'
import { resolveAssetUrl } from '../lib/assets'
import { cn } from '../lib/utils'
import type { Blog } from '../types'

type BlogResponse = Blog | { success: boolean; data: Blog }

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
  const coverImage = resolveAssetUrl(blog.coverImage || blog.image)

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group block rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-foreground/30"
    >
      <BlogCoverArt title={blog.title} imageSrc={coverImage} compact className="rounded-md" />
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-muted">{blog.category}</p>
      <h3 className="mt-2 font-display text-xl font-bold leading-tight text-foreground transition group-hover:text-muted">
        {blog.title}
      </h3>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-muted">
        {blog.readTime} min read
      </p>
    </Link>
  )
}

function CopyableCodeBlock({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false)
  const code = getTextFromChildren(children).replace(/\n$/, '')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="group relative my-8">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Code copied' : 'Copy code'}
        className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-md border border-border bg-bg/90 text-foreground opacity-100 shadow-sm backdrop-blur transition hover:bg-surface-2 sm:opacity-0 sm:group-hover:opacity-100"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre>{children}</pre>
    </div>
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
      .get<BlogResponse>(`/blogs/${slug}`)
      .then((response) => {
        const nextPost = 'data' in response.data ? response.data.data : response.data

        if (isActive && nextPost?._id) {
          setPost(nextPost)
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
    pre: ({ children }) => <CopyableCodeBlock>{children}</CopyableCodeBlock>,
  }

  const articleContent = useMemo(() => post?.content.replace(/^#\s+.+\n+/, '') ?? '', [post])
  const coverImage = resolveAssetUrl(post?.coverImage || post?.image)
  const description = useMemo(() => {
    return (
      articleContent
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .find((block) => block && !block.startsWith('#') && !block.startsWith('-')) ?? ''
    )
  }, [articleContent])

  const relatedPosts = useMemo(() => {
    if (!post) {
      return []
    }

    return BLOGS_MOCK.filter((blog) => blog.slug !== post.slug && blog.category === post.category).slice(
      0,
      3,
    )
  }, [post])

  const handleShare = async () => {
    if (!post) return

    const shareUrl = window.location.href

    if (navigator.share) {
      await navigator.share({ title: post.title, url: shareUrl })
      return
    }

    await navigator.clipboard.writeText(shareUrl)
  }

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
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-muted">
              Post not found
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold text-foreground">
              This article is not available.
            </h1>
            <Link
              to="/blog"
              className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.16em] text-bg"
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
        className="fixed left-0 top-0 z-70 h-1 w-full origin-left bg-accent"
      />

      <article className="mx-auto min-h-svh w-full max-w-5xl px-6 pb-24 pt-32 sm:px-8 lg:px-10">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-foreground"
          to="/blog"
        >
          <ArrowLeft size={17} />
          Back to Blog
        </Link>

        <BlogCoverArt
          title={post.title}
          imageSrc={coverImage}
          className="mt-16 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
        />

        <h1 className="mt-14 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-6xl">
          {post.title}
        </h1>

        <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">{description}</p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8 text-sm font-medium text-muted">
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={20} />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 size={18} />
              {post.readTime} min read
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
              {post.category}
            </span>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="rounded-xl border border-border px-5 py-3 font-semibold text-foreground transition hover:bg-accent hover:text-bg"
          >
            Share
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/blog?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border border-border px-3 py-1 transition hover:border-foreground hover:text-foreground"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="prose prose-portfolio max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeHighlight]}
              components={components}
            >
              {articleContent}
            </ReactMarkdown>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto rounded-3xl border border-border bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
              <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-muted">
                Table of Contents
              </p>
              <nav className="mt-4 space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-foreground',
                      item.level === 3 ? 'pl-6' : 'pl-3',
                      activeHeading === item.id && 'bg-surface-2 text-foreground',
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
          className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full bg-accent text-bg shadow-xl"
        >
          <ArrowUp size={20} />
        </motion.button>
      ) : null}
    </PageTransition>
  )
}
