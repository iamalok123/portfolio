import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowUp, CalendarDays, Check, Clock3, Copy, Hash, Eye, Share2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown, { type Components } from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { PageTransition } from '../components/layout/PageTransition'
import { BlogCoverArt } from '../components/ui/BlogCoverArt'
import { extractToc, slugify } from '../lib/blog'
import { api } from '../lib/axios'
import { resolveAssetUrl } from '../lib/assets'
import { cn } from '../lib/utils'
import { useSEO } from '../hooks/useSEO'
import type { Blog } from '../types'

type BlogResponse = Blog | { success: boolean; data: Blog }
type LenisScroll = {
  scrollTo: (target: HTMLElement | string, opts?: object) => void
  start?: () => void
  stop?: () => void
}

function getLenis() {
  return (window as Window & { lenis?: LenisScroll }).lenis
}

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
  const [post, setPost] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeHeading, setActiveHeading] = useState('')
  const [isTocOpen, setIsTocOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [viewsCount, setViewsCount] = useState<number | null>(null)
  const [hasViewed, setHasViewed] = useState(false)
  
  const bottomRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll()
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  // ── Dynamic SEO per blog post ──────────────────────────────────────────────
  const postDescription = useMemo(() => {
    if (!post) return 'Read tech articles by Alok Hotta on full-stack development, AI, React, Node.js and more.'
    const firstPara = post.content
      .replace(/^#\s+.+\n+/, '')
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .find((b) => b && !b.startsWith('#') && !b.startsWith('-')) ?? ''
    return firstPara.replace(/[*_`#\[\]]/g, '').slice(0, 155)
  }, [post])

  useSEO({
    title: post ? `${post.title} | Alok Hotta Blog` : 'Blog Post | Alok Hotta',
    description: postDescription,
    canonical: `/blog/${slug}`,
    ogType: 'article',
    ogImage: resolveAssetUrl(post?.coverImage || post?.image) || undefined,
    articlePublishedTime: post?.publishedAt,
    articleSection: 'Technology',
    articleTags: post?.tags,
  })

  // ── JSON-LD BlogPosting structured data ───────────────────────────────────
  useEffect(() => {
    if (!post) return
    const scriptId = 'blogpost-jsonld'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    const coverImg = resolveAssetUrl(post.coverImage || post.image)
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: postDescription,
      image: coverImg || `https://www.alokhotta.site/og-image.png`,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      url: `https://www.alokhotta.site/blog/${post.slug}`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.alokhotta.site/blog/${post.slug}` },
      author: {
        '@type': 'Person',
        name: 'Alok Hotta',
        url: 'https://www.alokhotta.site',
        sameAs: ['https://github.com/iamalok123', 'https://www.linkedin.com/in/alok-hotta'],
      },
      publisher: {
        '@type': 'Person',
        name: 'Alok Hotta',
        url: 'https://www.alokhotta.site',
        logo: { '@type': 'ImageObject', url: 'https://www.alokhotta.site/photo.png' },
      },
      keywords: post.tags.join(', '),
      timeRequired: `PT${post.readTime}M`,
    })
    return () => {
      const el = document.getElementById(scriptId)
      if (el) el.remove()
    }
  }, [post, postDescription, slug])

  const scrollToHeading = useCallback((id: string) => {
    const heading = document.getElementById(id)
    if (!heading) return

    const lenis = getLenis()

    if (lenis) {
      lenis.scrollTo(heading, {
        offset: -96,
        duration: 1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
      return
    }

    heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    let isActive = true

    api
      .get<BlogResponse>(`/blogs/${slug}`)
      .then((response) => {
        const nextPost = 'data' in response.data ? response.data.data : response.data

        if (isActive && nextPost?._id) {
          setPost(nextPost)
          setViewsCount(nextPost.views ?? 0)
        }
      })
      .catch(() => {
        if (isActive) {
          setPost(null)
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

  // ── Intersection Observer to trigger view increment ───────────────────────
  useEffect(() => {
    if (!post || hasViewed) return

    const viewedKey = `viewed_blog_${post.slug}`
    if (localStorage.getItem(viewedKey)) {
      setHasViewed(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasViewed(true)
          localStorage.setItem(viewedKey, 'true')
          
          api.post(`/blogs/${post.slug}/view`).then((res) => {
            if (res.data?.success) {
              setViewsCount(res.data.data)
            }
          }).catch(console.error)
          
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (bottomRef.current) {
      observer.observe(bottomRef.current)
    }

    return () => observer.disconnect()
  }, [post, hasViewed])

  const toc = useMemo(() => (post ? extractToc(post.content) : []), [post])

  useEffect(() => {
    if (!toc.length) {
      return
    }

    // Offset accounts for the sticky navbar so "current section" begins
    // right below it, not behind it.
    const SCROLL_OFFSET = 112

    let rafId = 0

    const updateActiveHeading = () => {
      const scrollY = window.scrollY + SCROLL_OFFSET

      // Resolve heading elements fresh each tick so dynamically-rendered
      // markdown headings are always found.
      const headingEls = toc
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => Boolean(el))

      if (!headingEls.length) return

      // Walk headings top-to-bottom.  The "active" heading is the last
      // one whose top edge has scrolled past the offset line.
      let activeId = headingEls[0].id

      for (const el of headingEls) {
        if (el.offsetTop <= scrollY) {
          activeId = el.id
        } else {
          break
        }
      }

      setActiveHeading((prev) => (prev === activeId ? prev : activeId))
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateActiveHeading)
    }

    // Run once immediately so the capsule is correct on mount / deep-link.
    updateActiveHeading()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [toc])

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isTocOpen) {
      return
    }

    const lenis = getLenis()
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    lenis?.stop?.()
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTocOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      lenis?.start?.()
    }
  }, [isTocOpen])

  const components: Components = {
    h2: ({ children, ...props }) => {
      const text = getTextFromChildren(children)
      const id = slugify(text)

      return (
        <h2 id={id} {...props}>
          <a className="heading-anchor" href={`#${id}`} aria-label={`Link to ${text}`}>
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
          <a className="heading-anchor" href={`#${id}`} aria-label={`Link to ${text}`}>
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
    hr: () => <hr aria-hidden="true" />,
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto">
        <table {...props}>{children}</table>
      </div>
    ),
    thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    th: ({ children, ...props }) => <th {...props}>{children}</th>,
    td: ({ children, ...props }) => <td {...props}>{children}</td>,
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

  const currentTocItem = useMemo(() => {
    return toc.find((item) => item.id === activeHeading) ?? toc[0]
  }, [activeHeading, toc])

  const handleTocClick = (id: string) => {
    setIsTocOpen(false)
    // Wait for the capsule close animation to finish before scrolling,
    // otherwise the scroll fights the layout animation visually.
    window.setTimeout(() => scrollToHeading(id), 340)
  }

  const handleShare = async () => {
    if (!post) return

    const shareUrl = window.location.href

    if (navigator.share) {
      const shareData: ShareData = {
        title: post.title,
        text: description,
        url: shareUrl,
      }

      try {
        if (coverImage) {
          const response = await fetch(coverImage)
          const blob = await response.blob()
          const file = new File([blob], 'cover.jpg', { type: blob.type })
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            shareData.files = [file]
          }
        }
      } catch (e) {
        // If fetching the image fails (e.g. CORS), we just share without the image
        console.error('Failed to attach image to share payload', e)
      }

      try {
        await navigator.share(shareData)
      } catch (e) {
        console.error('Error sharing', e)
      }
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
      <article className="mx-auto min-h-svh w-full max-w-5xl px-6 pb-40 pt-32 sm:px-8 sm:pb-44 lg:px-10">
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
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 rounded-xl border border-border px-5 py-3 font-semibold text-white transition hover:bg-accent hover:text-bg"
          >
            Share
            <Share2 size={16} />
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

        <div className="prose prose-portfolio mt-12 max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeHighlight]}
            components={components}
          >
            {articleContent}
          </ReactMarkdown>
        </div>

        {/* View Count at bottom left */}
        <div ref={bottomRef} className="mt-16 flex items-center gap-2 text-sm font-medium text-muted">
          <Eye size={18} />
          {viewsCount !== null ? (
            <span>{viewsCount.toLocaleString()} {viewsCount === 1 ? 'view' : 'views'}</span>
          ) : (
            <span className="h-5 w-16 animate-pulse rounded bg-surface-2" />
          )}
        </div>

      </article>

      {typeof document !== 'undefined'
        ? createPortal(
            <>
              {showBackToTop ? (
                <motion.button
                  type="button"
                  aria-label="Back to top"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className={cn(
                    'fixed right-6 z-50 grid size-12 place-items-center rounded-full bg-accent text-bg shadow-xl',
                    toc.length > 0 ? 'bottom-24 sm:bottom-28' : 'bottom-6',
                  )}
                >
                  <ArrowUp size={20} />
                </motion.button>
              ) : null}

              {toc.length > 0 ? (
                <>
                  <AnimatePresence>
                    {isTocOpen ? (
                      <motion.button
                        type="button"
                        aria-label="Close table of contents"
                        data-cursor="transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsTocOpen(false)}
                        className="fixed inset-0 z-70 bg-bg/55 backdrop-blur-lg"
                      />
                    ) : null}
                  </AnimatePresence>

                  <div className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-80 flex justify-center px-4 sm:bottom-6">
                    <motion.div
                      layout
                      transition={{ layout: { type: 'spring', stiffness: 400, damping: 34, mass: 0.8 } }}
                      role={isTocOpen ? 'dialog' : undefined}
                      aria-modal={isTocOpen ? 'true' : undefined}
                      aria-label={isTocOpen ? 'Table of contents' : undefined}
                      className={cn(
                        'w-[min(calc(100vw-2rem),30rem)] overflow-hidden rounded-[1.75rem] border border-border bg-surface/95 text-foreground shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl dark:shadow-[0_24px_90px_rgba(0,0,0,0.55)]',
                        isTocOpen ? 'max-h-[72svh] sm:max-h-[70svh]' : 'max-h-16',
                      )}
                    >
                      <AnimatePresence initial={false}>
                        {isTocOpen ? (
                          <motion.div
                            key="toc-panel"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                            exit={{ opacity: 0, y: 6, transition: { duration: 0.12 } }}
                            className="border-b border-border px-4 pb-4 pt-4 sm:px-5"
                          >
                            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-muted">
                              Table of Contents
                            </p>
                            <nav
                              id="blog-post-toc-menu"
                              aria-label="Article sections"
                              data-lenis-prevent
                              className="mt-3 max-h-[calc(72svh-8.75rem)] space-y-1 overflow-y-auto overscroll-contain pr-1 sm:max-h-[calc(70svh-9rem)]"
                            >
                              {toc.map((item) => {
                                const isActive = activeHeading === item.id

                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleTocClick(item.id)}
                                    className={cn(
                                      'flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-foreground hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_34px_rgba(0,0,0,0.35)] sm:text-base',
                                      item.level === 3 && 'pl-6 opacity-80',
                                      isActive &&
                                        'bg-surface-2 text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_34px_rgba(0,0,0,0.35)]',
                                    )}
                                  >
                                    <span>{item.text}</span>
                                    {isActive ? (
                                      <span className="size-2 shrink-0 rounded-full bg-foreground" />
                                    ) : null}
                                  </button>
                                )
                              })}
                            </nav>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <button
                        type="button"
                        aria-expanded={isTocOpen}
                        aria-controls="blog-post-toc-menu"
                        onClick={() => setIsTocOpen((value) => !value)}
                        className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-2 sm:px-5"
                      >
                        <span className="size-2.5 shrink-0 rounded-full bg-foreground" />
                        <span className="min-w-0 flex-1 truncate text-sm font-bold text-foreground sm:text-base">
                          {currentTocItem?.text ?? 'Table of Contents'}
                        </span>
                        <svg
                          viewBox="0 0 36 36"
                          aria-hidden="true"
                          className="size-9 shrink-0 -rotate-90 text-foreground"
                        >
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            strokeOpacity="0.2"
                            strokeWidth="4"
                          />
                          <motion.circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="4"
                            pathLength="1"
                            style={{ pathLength: progressScale }}
                          />
                        </svg>
                      </button>
                    </motion.div>
                  </div>
                </>
              ) : null}
            </>,
            document.body,
          )
        : null}
    </PageTransition>
  )
}
