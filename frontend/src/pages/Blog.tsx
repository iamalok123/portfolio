import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock3,
  Filter,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'
import { BlogCoverArt } from '../components/ui/BlogCoverArt'
import { getBlogExcerpt } from '../lib/blog'
import { api } from '../lib/axios'
import { resolveAssetUrl } from '../lib/assets'
import { cn } from '../lib/utils'
import type { Blog as BlogType } from '../types'

type SortMode = 'latest' | 'oldest' | 'readTime'
type BlogListResponse = BlogType[] | { success: boolean; data: BlogType[] }
type FilterOption = {
  label: string
  type: 'all' | 'tag'
  count: number
}

const SORT_OPTIONS: { label: string; value: SortMode }[] = [
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Reading Time', value: 'readTime' },
]

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
    <article
      style={{ transitionDelay: `${index * 24}ms` }}
      className="group flex h-full overflow-hidden rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-foreground/30"
    >
      <Link to={`/blog/${blog.slug}`} className="flex min-h-full w-full flex-col">
        <BlogCoverArt title={blog.title} imageSrc={coverImage} compact className="rounded-md" />
        <div className="flex flex-1 flex-col pt-5">
          <h2 className="line-clamp-2 font-display text-2xl font-bold leading-tight text-foreground transition group-hover:text-muted">
            {blog.title}
          </h2>
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
            <div className="mt-3 flex flex-wrap items-center gap-4 pl-1.5 pt-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">
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
        </div>
      </Link>
    </article>
  )
}

export function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<BlogType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [showAllTopics, setShowAllTopics] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortMenuRef = useRef<HTMLDivElement>(null)

  const activeTag = searchParams.get('tag') ?? ''
  const sort = (searchParams.get('sort') as SortMode | null) ?? 'latest'
  const activeSortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label ?? 'Latest'

  useEffect(() => {
    let isActive = true

    api
      .get<BlogListResponse>('/blogs')
      .then((response) => {
        const nextPosts = Array.isArray(response.data) ? response.data : response.data.data

        if (isActive && Array.isArray(nextPosts)) {
          setPosts(nextPosts)
        }
      })
      .catch(() => {
        if (isActive) {
          setPosts([])
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
    if (!searchParams.has('category')) {
      return
    }

    const next = new URLSearchParams(searchParams)
    next.delete('category')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

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

  useEffect(() => {
    if (!isSortOpen) {
      return
    }

    const closeSortMenu = (event: MouseEvent) => {
      if (!sortMenuRef.current?.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSortOpen(false)
      }
    }

    document.addEventListener('mousedown', closeSortMenu)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('mousedown', closeSortMenu)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isSortOpen])

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts],
  )

  const filterOptions = useMemo<FilterOption[]>(() => {
    const tagCounts = new Map<string, number>()

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
      })
    })

    return [
      { label: 'All', type: 'all', count: posts.length },
      ...allTags.map((tag) => ({
        label: tag,
        type: 'tag' as const,
        count: tagCounts.get(tag) ?? 0,
      })),
    ]
  }, [allTags, posts])

  const visibleFilterOptions = useMemo(() => {
    if (showAllTopics) {
      return filterOptions
    }

    if (activeTag) {
      const allOption = filterOptions.find((option) => option.type === 'all')
      const activeOption = filterOptions.find(
        (option) => option.type === 'tag' && option.label === activeTag,
      )

      if (allOption && activeOption) {
        return [
          allOption,
          activeOption,
          ...filterOptions.filter(
            (option) => option.label !== allOption.label && option.label !== activeOption.label,
          ),
        ]
      }
    }

    return filterOptions
  }, [activeTag, filterOptions, showAllTopics])

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return [...posts]
      .filter((post) => (activeTag ? post.tags.includes(activeTag) : true))
      .filter((post) => {
        if (!normalizedQuery) {
          return true
        }

        return [post.title, ...post.tags]
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
  }, [activeTag, posts, query, sort])

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)

    if (!value || value === 'All') {
      next.delete(key)
    } else {
      next.set(key, value)
    }

    setSearchParams(next)
  }

  const updateFilter = (option: FilterOption) => {
    const next = new URLSearchParams(searchParams)

    next.delete('category')
    next.delete('tag')

    if (option.type === 'tag') {
      next.set('tag', option.label)
    }

    setSearchParams(next)
  }

  const isFilterActive = (option: FilterOption) => {
    if (option.type === 'all') {
      return !activeTag
    }

    return activeTag === option.label
  }

  const clearFilters = () => {
    setQuery('')
    setSearchParams(new URLSearchParams())
  }

  return (
    <PageTransition>
      <section className="mx-auto min-h-svh w-full max-w-7xl px-6 pb-24 pt-32 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-end">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-muted">
              Blog
            </p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-none text-foreground sm:text-7xl">
              Thoughts & Writings
            </h1>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:justify-end">
            <label
              className="flex h-12 w-full min-w-0 items-center gap-3 rounded-full border border-border bg-surface px-4 text-muted transition focus-within:border-foreground sm:w-65 lg:w-72"
              htmlFor="blog-search"
            >
              <Search size={18} className="shrink-0 text-foreground" />
              <input
                id="blog-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title or tags"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted"
              />
            </label>

            <div ref={sortMenuRef} className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsSortOpen((value) => !value)}
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                className="flex h-12 w-full items-center gap-3 rounded-full border border-border bg-surface px-4 text-muted transition hover:border-foreground focus:border-foreground focus:outline-none sm:min-w-44"
              >
                <SlidersHorizontal size={18} className="shrink-0 text-foreground" />
                <span className="min-w-0 flex-1 text-left text-sm font-semibold text-foreground">
                  {activeSortLabel}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    'shrink-0 text-foreground transition',
                    isSortOpen && 'rotate-180',
                  )}
                />
              </button>

              <div
                role="listbox"
                aria-label="Sort blog posts"
                className={cn(
                  'absolute right-0 top-[calc(100%+0.5rem)] z-40 w-full overflow-hidden rounded-lg border border-border bg-surface p-1 text-foreground shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition dark:shadow-[0_18px_70px_rgba(0,0,0,0.5)] sm:w-48',
                  isSortOpen
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none -translate-y-1 opacity-0',
                )}
              >
                {SORT_OPTIONS.map((option) => {
                  const isActive = option.value === sort

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        updateParam('sort', option.value)
                        setIsSortOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center rounded-md px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-surface-2 hover:text-foreground',
                        isActive
                          ? 'bg-foreground text-bg hover:bg-foreground hover:text-bg'
                          : 'text-muted',
                      )}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-border bg-surface p-3 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:gap-4">
            <div className="flex items-center gap-3 text-muted">
              <Filter size={17} className="shrink-0 text-foreground sm:size-[18px]" />
              <span className="font-display text-xs font-bold uppercase tracking-[0.16em] sm:text-sm">
                Explore by topic
              </span>
            </div>
            {(query || activeTag) && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-foreground hover:text-foreground sm:px-4 sm:py-2 sm:text-sm"
              >
                <X size={16} />
                Clear filters
              </button>
            )}
          </div>

          <div
            className={cn(
              'mt-4 flex min-w-0 gap-2 sm:mt-5 sm:gap-3',
              showAllTopics ? 'flex-col sm:flex-row sm:items-start' : 'items-start',
            )}
          >
            <div
              className={cn(
                'flex min-w-0 flex-1 gap-2',
                showAllTopics ? 'flex-wrap' : 'flex-nowrap overflow-hidden',
              )}
            >
              {visibleFilterOptions.map((option) => {
                const isActive = isFilterActive(option)

                return (
                  <button
                    key={`${option.type}-${option.label}`}
                    type="button"
                    onClick={() => updateFilter(option)}
                    className={cn(
                      'group inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-foreground hover:text-foreground sm:min-h-10 sm:px-4 sm:py-2 sm:text-sm',
                      isActive && 'border-accent bg-accent text-bg hover:text-bg',
                    )}
                  >
                    <span>{option.label}</span>
                    <span
                      className={cn(
                        'rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] font-bold leading-none text-muted transition sm:px-2 sm:text-[11px]',
                        isActive && 'border-bg/20 bg-bg/15 text-bg',
                      )}
                    >
                      {option.count}
                    </span>
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowAllTopics((value) => !value)}
              className={cn(
                'inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-foreground hover:text-foreground sm:min-h-10 sm:px-4 sm:py-2 sm:text-sm',
                showAllTopics && 'w-fit',
              )}
            >
              {showAllTopics ? (
                <>
                  Show less
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show more
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <BlogSkeleton key={index} />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post._id} blog={post} index={index} />
              ))}
            </div>
          ) : (
            <div
              className="grid min-h-80 place-items-center rounded-lg border border-dashed border-border bg-surface text-center"
            >
              <div>
                <SearchX className="mx-auto text-foreground" size={40} />
                <p className="mt-4 font-display text-2xl font-bold text-foreground">
                  No posts found
                </p>
                <p className="mt-2 text-sm text-muted">Try a broader search or reset filters.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
