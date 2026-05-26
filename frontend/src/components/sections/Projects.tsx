import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, GitFork, Globe, SearchX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/axios'
import { resolveAssetUrl } from '../../lib/assets'
import { cn } from '../../lib/utils'
import type { Project } from '../../types'

const MotionLink = motion(Link)

const filters = [
  'All',
  'Full-Stack',
  'Frontend',
  'AI/ML',
  'Open Source',
  'React',
  'Node.js',
  'TypeScript',
]

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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const coverImage = resolveAssetUrl(project.coverImage || project.image)
  const [failedImageSrc, setFailedImageSrc] = useState('')
  const showCoverImage = Boolean(coverImage && failedImageSrc !== coverImage)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 150, damping: 22, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/40"
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
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} GitHub`}
              className="grid size-9 place-items-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent"
            >
              <GitFork size={16} />
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} live site`}
              className="grid size-9 place-items-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent"
            >
              <Globe size={16} />
            </a>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{project.desc}</p>
        <div className="mt-auto pt-5 flex flex-wrap gap-2">
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

export function Projects({ showViewAll = true }: { showViewAll?: boolean }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    api
      .get<{ success: boolean; data: Project[] }>('/projects')
      .then((res) => {
        if (isActive && res.data.success && Array.isArray(res.data.data)) {
          setProjects(res.data.data)
        }
      })
      .catch(() => {
        if (isActive) {
          setProjects([])
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

  const filteredProjects = useMemo(() => {
    const ordered = [...projects].sort((a, b) => a.order - b.order)

    if (activeFilter === 'All') {
      return ordered
    }

    return ordered.filter(
      (project) =>
        project.tags.includes(activeFilter) || project.techStack.includes(activeFilter)
    )
  }, [activeFilter, projects])

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

          <div className="flex flex-wrap items-center gap-2 lg:max-w-[50%] lg:justify-end">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'relative shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition',
                  activeFilter === filter
                    ? 'border-transparent text-bg'
                    : 'border-border bg-surface text-muted hover:text-foreground'
                )}
              >
                {activeFilter === filter ? (
                  <motion.span
                    layoutId="active-project-filter"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10">{filter}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project._id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid min-h-72 place-items-center rounded-lg border border-dashed border-border bg-surface text-center"
            >
              <div>
                <SearchX className="mx-auto text-accent" size={36} />
                <p className="mt-4 font-display text-2xl font-bold text-foreground">
                  No projects found
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {showViewAll ? (
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
    </section>
  )
}
