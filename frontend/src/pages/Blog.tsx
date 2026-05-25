import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Clock3, Filter, Search, SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'
import { BlogCoverArt } from '../components/ui/BlogCoverArt'
import { BLOG_CATEGORIES, BLOGS_MOCK } from '../data/blogs'
import { getBlogExcerpt } from '../lib/blog'
import { api } from '../lib/axios'
import { resolveAssetUrl } from '../lib/assets'
import { cn } from '../lib/utils'
import type { Blog as BlogType } from '../types'

type SortMode = 'latest' | 'oldest' | 'readTime'
type BlogListResponse = BlogType[] | { success: boolean; data: BlogType[] }

function BlogSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="h-44 animate-pulse rounded-md bg-surface-2" />
      <div className="mt-5 h-5 w-24 animate-pulse rounded bg-surface-2" />
      <div className="mt-4 h-6 w-4/5 animate-pulse rounded bg-surface-2" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-surface-2" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-surface-2" />
    </div>
  )
}

function BlogCard({ blog, index }: { blog: BlogType; index: number }) {
  const coverImage = resolveAssetUrl(blog.coverImage || blog.image)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 160, damping: 22, delay: index * 0.035 }}
      className="group flex h-full overflow-hidden rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-foreground/30"
    >
      <Link to={`/blog/${blog.slug}`} className="flex min-h-full w-full flex-col">
        <BlogCoverArt title={blog.title} imageSrc={coverImage} compact className="rounded-md" />
        <div className="flex flex-1 flex-col pt-5">
          <span className="w-fit rounded-full border border-border bg-surface-2/60 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-muted backdrop-blur">
            {blog.category}
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-foreground transition group-hover:text-muted">
            {blog.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{getBlogExcerpt(blog)}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {blog.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-xs font-medium uppercase tracking-[0.14em] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              {blog.readTime} min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<BlogType[]>(BLOGS_MOCK)
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')

  const category = searchParams.get('category') ?? 'All'
  const activeTag = searchParams.get('tag') ?? ''
  const sort = (searchParams.get('sort') as SortMode | null) ?? 'latest'

  useEffect(() => {
    let isActive = true

    api
      .get<BlogListResponse>('/blogs')
      .then((response) => {
        const nextPosts = Array.isArray(response.data) ? response.data : response.data.data

        if (isActive && Array.isArray(nextPosts) && nextPosts.length > 0) {
          setPosts(nextPosts)
        }
      })
      .catch(() => {
        if (isActive) {
          setPosts(BLOGS_MOCK)
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
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const currentQuery = searchParams.get('q') ?? ''
      const nextQuery = query.trim()

      if (currentQuery === nextQuery) {
        return
      }

      const next = new URLSearchParams(searchParams)
      if (nextQuery) {
        next.set('q', nextQuery)
      } else {
        next.delete('q')
      }
      setSearchParams(next, { replace: true })
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [query, searchParams, setSearchParams])

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts],
  )

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return [...posts]
      .filter((post) => (category === 'All' ? true : post.category === category))
      .filter((post) => (activeTag ? post.tags.includes(activeTag) : true))
      .filter((post) => {
        if (!normalizedQuery) {
          return true
        }

        return [post.title, post.category, ...post.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      })
      .sort((a, b) => {
        if (sort === 'oldest') {
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        }

        if (sort === 'readTime') {
          return b.readTime - a.readTime
        }

        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      })
  }, [activeTag, category, posts, query, sort])

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)

    if (!value || value === 'All') {
      next.delete(key)
    } else {
      next.set(key, value)
    }

    setSearchParams(next)
  }

  const clearFilters = () => {
    setQuery('')
    setSearchParams(new URLSearchParams())
  }

  return (
    <PageTransition>
      <section className="mx-auto min-h-svh w-full max-w-7xl px-6 pb-24 pt-32 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_23rem] lg:items-end">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-muted">
              Blog
            </p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-none text-foreground sm:text-7xl">
              Thoughts & Writings
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {filteredPosts.length} of {posts.length} posts, filtered by practical
              engineering notes, projects, career lessons, and open-source preparation.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center gap-3 text-muted">
              <SlidersHorizontal size={18} className="text-foreground" />
              <span className="font-display text-sm font-bold uppercase tracking-[0.16em]">
                Sort
              </span>
            </div>
            <select
              value={sort}
              onChange={(event) => updateParam('sort', event.target.value)}
              className="mt-3 w-full rounded-md border border-border bg-bg px-4 py-3 text-foreground outline-none transition focus:border-foreground"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="readTime">Reading Time</option>
            </select>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[18rem_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-border bg-surface p-4">
              <label className="flex items-center gap-3 text-muted" htmlFor="blog-search">
                <Search size={18} className="text-foreground" />
                <span className="font-display text-sm font-bold uppercase tracking-[0.16em]">
                  Search
                </span>
              </label>
              <motion.input
                id="blog-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                whileFocus={{ scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                placeholder="Search title or tags"
                className="mt-3 w-full rounded-md border border-border bg-bg px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-foreground"
              />
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-4 flex items-center gap-3 text-muted">
                <Filter size={18} className="text-foreground" />
                <span className="font-display text-sm font-bold uppercase tracking-[0.16em]">
                  Category
                </span>
              </div>
              <div className="flex flex-wrap gap-2 lg:flex-col">
                {BLOG_CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateParam('category', item)}
                    className={cn(
                      'rounded-full border border-border px-3 py-2 text-left text-sm font-semibold text-muted transition hover:border-foreground hover:text-foreground',
                      category === item && 'border-accent bg-accent text-bg hover:text-bg',
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="font-display text-sm font-bold uppercase tracking-[0.16em] text-muted">
                  Tag Cloud
                </span>
                {activeTag ? (
                  <button
                    type="button"
                    onClick={() => updateParam('tag', '')}
                    aria-label="Clear tag filter"
                    className="text-foreground"
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <motion.button
                    key={tag}
                    type="button"
                    onClick={() => updateParam('tag', tag)}
                    whileTap={{ scale: 0.94 }}
                    className={cn(
                      'rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-foreground hover:text-foreground',
                      activeTag === tag && 'border-accent bg-accent text-bg hover:text-bg',
                    )}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          </aside>

          <div>
            {(query || activeTag || category !== 'All') && (
              <button
                type="button"
                onClick={clearFilters}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted transition hover:border-foreground hover:text-foreground"
              >
                <X size={16} />
                Clear filters
              </button>
            )}

            {isLoading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <BlogSkeleton key={index} />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post, index) => (
                    <BlogCard key={post._id} blog={post} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid min-h-80 place-items-center rounded-lg border border-dashed border-border bg-surface text-center"
              >
                <div>
                  <SearchX className="mx-auto text-foreground" size={40} />
                  <p className="mt-4 font-display text-2xl font-bold text-foreground">
                    No posts found
                  </p>
                  <p className="mt-2 text-sm text-muted">Try a broader search or reset filters.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
