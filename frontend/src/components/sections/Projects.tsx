import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, ExternalLink, Filter, Globe, Search, SearchX, X } from 'lucide-react'
import { Github } from 'react-bootstrap-icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../lib/axios'
import { resolveAssetUrl } from '../../lib/assets'
import { cn } from '../../lib/utils'
import { STATIC_PROJECTS } from '../../data/projects'
import { ProjectHoverCaseStudy } from '../ui/ProjectHoverCaseStudy'
import type { Project } from '../../types'

const MotionLink = motion(Link)

type FilterOption = {
  label: string
  type: 'all' | 'tech'
  count: number
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface p-4">
      <div className="h-44 animate-pulse rounded-md bg-surface-2" />
      <div className="mt-5 h-5 w-2/3 animate-pulse rounded bg-surface-2" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-surface-2" />
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-surface-2" />
    </div>
  )
}

function ProjectCard({
  project,
  index,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onCardClick,
}: {
  project: Project
  index: number
  isHovered?: boolean
  onHoverStart: (project: Project, rect: DOMRect) => void
  onHoverEnd: () => void
  onCardClick?: (project: Project, rect: DOMRect) => void
}) {
  const cardRef = useRef<HTMLElement>(null)
  const coverImage = resolveAssetUrl(project.coverImage || project.image)
  const [failedImageSrc, setFailedImageSrc] = useState('')
  const showCoverImage = Boolean(coverImage && failedImageSrc !== coverImage)

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 150, damping: 22, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        onHoverStart(project, rect)
      }}
      onMouseLeave={onHoverEnd}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a, button')) return
        if (cardRef.current) {
          onCardClick?.(project, cardRef.current.getBoundingClientRect())
        }
      }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface p-4 transition-all duration-200 hover:border-accent/40',
        isHovered && 'z-50 border-accent/70 shadow-2xl shadow-accent/15 ring-1 ring-accent/40'
      )}
    >
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noreferrer"
        className="relative block aspect-video overflow-hidden rounded-md bg-surface-2"
      >
        {showCoverImage ? (
          <img
            src={coverImage}
            alt={`${project.title} preview`}
            loading="lazy"
            onError={() => setFailedImageSrc(coverImage)}
            className="absolute inset-0 size-full object-cover grayscale transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_28%,transparent),transparent_46%),radial-gradient(circle_at_82%_18%,color-mix(in_srgb,var(--foreground)_14%,transparent),transparent_16rem)] transition duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-bg/80 via-bg/10 to-transparent" />
        <div className="absolute inset-0 grid place-items-center bg-black/55 opacity-0 transition group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-bg">
            View Live
            <ExternalLink size={15} />
          </span>
        </div>
      </a>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-extrabold text-foreground">{project.title}</h3>
          <div className="flex shrink-0 gap-2 opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} GitHub`}
                className="grid size-9 place-items-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent"
              >
                <Github size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} live site`}
                className="grid size-9 place-items-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent"
              >
                <Globe size={16} />
              </a>
            )}
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{project.desc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

/**
 * Smart matcher for project technologies and text queries.
 * Normalizes differences between 'React' / 'React.js', 'Next.js', 'AI', 'PostgreSQL', etc.
 */
function matchProject(project: Project, activeTech: string, searchInput: string): boolean {
  if (searchInput.trim()) {
    const q = searchInput.toLowerCase().trim()
    const matchTitle = project.title.toLowerCase().includes(q)
    const matchDesc = project.desc.toLowerCase().includes(q)
    const matchTech = project.techStack.some((t) => t.toLowerCase().includes(q))
    const matchProblem = project.caseStudy?.problem?.toLowerCase().includes(q)
    const matchTagline = project.caseStudy?.tagline?.toLowerCase().includes(q)
    if (!matchTitle && !matchDesc && !matchTech && !matchProblem && !matchTagline) {
      return false
    }
  }

  if (!activeTech || activeTech.toLowerCase() === 'all') {
    return true
  }

  const f = activeTech.toLowerCase().trim()

  if (f === 'ai' || f === 'ai & llm' || f === 'ai & llm systems' || f === 'ai / ml') {
    const aiKeywords = ['gemini', 'rag', 'openrouter', 'inngest', 'cloudflare workers ai', 'ai', 'llm']
    return (
      project.techStack.some((t) => aiKeywords.some((k) => t.toLowerCase().includes(k))) ||
      /ai|llm|rag|gemini|openrouter/i.test(project.title + ' ' + project.desc)
    )
  }

  if (f === 'next.js' || f === 'nextjs' || f === 'next') {
    return project.techStack.some((t) => t.toLowerCase().includes('next'))
  }

  if (f === 'react' || f === 'react.js') {
    return project.techStack.some((t) => t.toLowerCase().includes('react'))
  }

  if (f === 'node.js' || f === 'node' || f === 'full-stack' || f === 'mern' || f === 'pern') {
    return project.techStack.some((t) =>
      /node|express|mongodb|postgresql|supabase|prisma/i.test(t)
    )
  }

  if (f === 'postgresql' || f === 'postgres') {
    return project.techStack.some((t) => /postgres|supabase/i.test(t))
  }

  if (f === 'mongodb' || f === 'mongo') {
    return project.techStack.some((t) => t.toLowerCase().includes('mongo'))
  }

  if (f === 'socket.io' || f === 'real-time' || f === 'websocket') {
    return (
      project.techStack.some((t) => /socket|realtime/i.test(t)) ||
      /realtime|chat/i.test(project.title + ' ' + project.desc)
    )
  }

  return project.techStack.some(
    (t) => t.toLowerCase() === f || t.toLowerCase().includes(f)
  )
}

export function Projects({ showViewAll = true }: { showViewAll?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS)
  const [isLoading, setIsLoading] = useState(false)
  const [showAllTopics, setShowAllTopics] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const activeTech = searchParams.get('tech') ?? ''
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const [cardRect, setCardRect] = useState<DOMRect | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsTouchDevice(touch)
    }
  }, [])

  const handleHoverStart = (project: Project, rect: DOMRect) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setHoveredProject(project)
    setCardRect(rect)
  }

  const handleHoverEnd = () => {
    if (isTouchDevice) return
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredProject(null)
      setCardRect(null)
    }, 180)
  }

  const handleMouseEnterPopup = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const handleMouseLeavePopup = () => {
    if (isTouchDevice) return
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredProject(null)
      setCardRect(null)
    }, 120)
  }

  const handleCardClick = (project: Project, rect: DOMRect) => {
    if (hoveredProject?._id === project._id) {
      setHoveredProject(null)
      setCardRect(null)
    } else {
      setHoveredProject(project)
      setCardRect(rect)
    }
  }

  const handleClosePopup = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    setHoveredProject(null)
    setCardRect(null)
  }

  // Sync external filter events (from CommandPalette or global links)
  useEffect(() => {
    const handleFilterProjects = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      const tech = customEvent.detail
      const next = new URLSearchParams(searchParams)
      if (!tech || tech.toLowerCase() === 'all') {
        next.delete('tech')
      } else {
        next.set('tech', tech)
      }
      setSearchParams(next)
    }

    window.addEventListener('filter-projects', handleFilterProjects)
    return () => window.removeEventListener('filter-projects', handleFilterProjects)
  }, [searchParams, setSearchParams])

  useEffect(() => {
    let isActive = true

    api
      .get<{ success: boolean; data: Project[] }>('/projects')
      .then((res) => {
        if (isActive && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          // Merge API data with any local case studies
          const merged = res.data.data.map((p) => {
            const staticMatch = STATIC_PROJECTS.find(
              (sp) => sp.title.toLowerCase() === p.title.toLowerCase() || sp._id === p._id
            )
            return staticMatch?.caseStudy ? { ...p, caseStudy: staticMatch.caseStudy } : p
          })
          setProjects(merged)
        }
      })
      .catch(() => {
        if (isActive) {
          // Fall back gracefully to local static projects on error or cold-start
          setProjects(STATIC_PROJECTS)
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

  const allTech = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.techStack))).sort(),
    [projects],
  )

  const filterOptions = useMemo<FilterOption[]>(() => {
    const techCounts = new Map<string, number>()

    projects.forEach((project) => {
      project.techStack.forEach((tech) => {
        techCounts.set(tech, (techCounts.get(tech) ?? 0) + 1)
      })
    })

    return [
      { label: 'All', type: 'all', count: projects.length },
      ...allTech.map((tech) => ({
        label: tech,
        type: 'tech' as const,
        count: techCounts.get(tech) ?? 0,
      })),
    ]
  }, [allTech, projects])

  const visibleFilterOptions = useMemo(() => {
    if (showAllTopics) {
      return filterOptions
    }

    if (activeTech) {
      const allOption = filterOptions.find((option) => option.type === 'all')
      const activeOption = filterOptions.find(
        (option) => option.type === 'tech' && option.label.toLowerCase() === activeTech.toLowerCase(),
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
  }, [activeTech, filterOptions, showAllTopics])

  const visibleProjects = useMemo(() => {
    const ordered = [...projects].sort((a, b) => a.order - b.order)
    const filtered = ordered.filter((project) => matchProject(project, activeTech, searchInput))

    // Only limit to 3 if on the homepage AND no active filter or search query is present
    return showViewAll && !activeTech && !searchInput ? filtered.slice(0, 3) : filtered
  }, [activeTech, projects, searchInput, showViewAll])

  const updateFilter = (option: FilterOption) => {
    const next = new URLSearchParams(searchParams)

    next.delete('tech')

    if (option.type === 'tech') {
      next.set('tech', option.label)
    }

    setSearchParams(next)
  }

  const isFilterActive = (option: FilterOption) => {
    if (option.type === 'all') {
      return !activeTech
    }

    return activeTech.toLowerCase() === option.label.toLowerCase()
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchParams(new URLSearchParams())
  }

  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-accent">
              // selected_work
            </p>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-foreground sm:text-6xl">
              Projects Built To Ship.
            </h2>
          </div>
        </div>

        {/* Filter Bar on Dedicated Projects Page */}
        {!showViewAll && (
          <div className="mt-10 rounded-lg border border-border bg-surface p-3 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:gap-4">
              <div className="flex items-center gap-3 text-muted">
                <Filter size={17} className="shrink-0 text-foreground sm:size-4.5" />
                <span className="font-display text-xs font-bold uppercase tracking-[0.16em] sm:text-sm">
                  Explore by topic
                </span>
              </div>

              {/* Real-time Project Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search projects by title, stack, or problem..."
                  className="w-full rounded-full border border-border bg-bg py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none sm:text-sm"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {(activeTech || searchInput) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-foreground hover:text-foreground sm:px-4 sm:py-2 sm:text-sm cursor-pointer"
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
                        'group inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-foreground hover:text-foreground sm:min-h-10 sm:px-4 sm:py-2 sm:text-sm cursor-pointer',
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
                  'inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-foreground hover:text-foreground sm:min-h-10 sm:px-4 sm:py-2 sm:text-sm cursor-pointer',
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
        )}

        {/* Active Filter Notice on Homepage */}
        {showViewAll && (activeTech || searchInput) && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/40 bg-accent/5 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
              <span className="font-bold text-accent">Active Filter:</span>
              {activeTech && (
                <span className="rounded-full bg-surface border border-border px-3 py-1 text-xs font-mono font-semibold text-foreground">
                  Stack: {activeTech}
                </span>
              )}
              {searchInput && (
                <span className="rounded-full bg-surface border border-border px-3 py-1 text-xs font-mono font-semibold text-foreground">
                  &ldquo;{searchInput}&rdquo;
                </span>
              )}
              <span className="text-xs text-muted">
                ({visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'} found)
              </span>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground hover:border-accent transition cursor-pointer"
            >
              <X size={13} />
              Reset Filters
            </button>
          </div>
        )}

        <div className={showViewAll && !activeTech && !searchInput ? 'mt-12' : 'mt-8'}>
          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : visibleProjects.length > 0 ? (
            <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    index={index}
                    isHovered={hoveredProject?._id === project._id}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    onCardClick={handleCardClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid min-h-72 place-items-center rounded-lg border border-dashed border-border bg-surface text-center p-8"
            >
              <div>
                <SearchX className="mx-auto text-accent" size={36} />
                <p className="mt-4 font-display text-2xl font-bold text-foreground">
                  No projects found
                </p>
                <p className="mt-2 text-sm text-muted">
                  No applications matched &ldquo;{activeTech || searchInput}&rdquo;. Try another stack or clear the filter.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:border-accent transition cursor-pointer"
                >
                  <X size={14} />
                  Reset all filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {showViewAll && !activeTech && !searchInput ? (
          <div className="mt-10 flex justify-center">
            <MotionLink
              to="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 360, damping: 22 }}
              style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
              className="inline-flex rounded-full px-6 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em]"
            >
              View All Projects
            </MotionLink>
          </div>
        ) : null}
      </div>

      {/* Hover Case Study Preview & Backdrop Blur */}
      <ProjectHoverCaseStudy
        project={hoveredProject}
        cardRect={cardRect}
        onMouseEnterPopup={handleMouseEnterPopup}
        onMouseLeavePopup={handleMouseLeavePopup}
        onClose={handleClosePopup}
        isTouch={isTouchDevice}
      />
    </section>
  )
}
