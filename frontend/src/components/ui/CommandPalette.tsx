import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Copy,
  Download,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  Home,
  Layers,
  Mail,
  Moon,
  Search,
  Sun,
  User,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { cn } from '../../lib/utils'
import { useModalScrollLock } from '../../hooks/useModalScrollLock'
import { STATIC_PROJECTS } from '../../data/projects'
import { STATIC_BLOGS } from '../../data/blogs'

export interface CommandItem {
  id: string
  title: string
  subtitle?: string
  Icon: LucideIcon
  action: () => void
  keywords?: string[]
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  useModalScrollLock(isOpen)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Native non-passive wheel handling: smooth dialog scrolling, background completely static
  useEffect(() => {
    if (!isOpen) return

    const cardEl = cardRef.current
    const listEl = listRef.current
    const backdropEl = backdropRef.current
    const wrapperEl = wrapperRef.current

    const handleCardWheel = (e: WheelEvent) => {
      e.stopPropagation()

      if (!listEl) {
        e.preventDefault()
        return
      }

      // If wheel event originates from inside the scrollable list
      if (listEl.contains(e.target as Node)) {
        const { scrollTop, scrollHeight, clientHeight } = listEl
        const delta = e.deltaY

        const isScrollingDown = delta > 0
        const isScrollingUp = delta < 0

        const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight
        const isAtTop = scrollTop <= 0

        // Prevent wheel from bubbling to window when reaching list boundaries
        if ((isScrollingDown && isAtBottom) || (isScrollingUp && isAtTop)) {
          e.preventDefault()
        }
        return
      }

      // If wheel event is on search input, header, or footer:
      // Forward scroll directly to the list and prevent background scroll!
      e.preventDefault()
      listEl.scrollTop += e.deltaY
    }

    const blockEvent = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }

    if (cardEl) {
      cardEl.addEventListener('wheel', handleCardWheel, { passive: false })
    }
    if (backdropEl) {
      backdropEl.addEventListener('wheel', blockEvent, { passive: false })
      backdropEl.addEventListener('touchmove', blockEvent, { passive: false })
    }
    if (wrapperEl) {
      const handleWrapperWheel = (e: WheelEvent) => {
        if (e.target === wrapperEl) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      wrapperEl.addEventListener('wheel', handleWrapperWheel, { passive: false })
      wrapperEl.addEventListener('touchmove', blockEvent, { passive: false })
    }

    return () => {
      if (cardEl) {
        cardEl.removeEventListener('wheel', handleCardWheel)
      }
      if (backdropEl) {
        backdropEl.removeEventListener('wheel', blockEvent)
        backdropEl.removeEventListener('touchmove', blockEvent)
      }
      if (wrapperEl) {
        wrapperEl.removeEventListener('wheel', blockEvent)
        wrapperEl.removeEventListener('touchmove', blockEvent)
      }
    }
  }, [isOpen])

  const navigate = useNavigate()
  const location = useLocation()
  const { resolvedTheme, setTheme } = useTheme()

  const navigateToSection = useCallback(
    (sectionId: string) => {
      onClose()
      if (location.pathname === '/') {
        const el = document.getElementById(sectionId)
        if (el) {
          const lenis = (window as Window & { lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).lenis
          if (lenis) {
            lenis.scrollTo(el, { offset: 0, duration: 1.2 })
          } else {
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }
      } else {
        navigate(`/#${sectionId}`)
      }
    },
    [location.pathname, navigate, onClose]
  )

  const openCaseStudyModal = useCallback(
    (projectId: string) => {
      onClose()
      const project = STATIC_PROJECTS.find((p) => p._id === projectId)
      if (project) {
        window.dispatchEvent(new CustomEvent('open-case-study', { detail: project }))
      }
    },
    [onClose]
  )

  const items: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // ── Architectural Case Studies ─────────────────────────────────────────
      ...STATIC_PROJECTS.filter((p) => Boolean(p.caseStudy)).map((p) => ({
        id: `case-study-${p._id}`,
        title: `${p.title} Case Study`,
        subtitle: p.caseStudy?.tagline || p.desc,
        Icon: Layers,
        keywords: ['case study', 'architecture', 'deep dive', p.title, ...p.techStack],
        action: () => openCaseStudyModal(p._id),
      })),

      // ── Projects Showcase ──────────────────────────────────────────────────
      ...STATIC_PROJECTS.map((p) => ({
        id: `project-${p._id}`,
        title: p.title,
        subtitle: p.desc,
        Icon: FolderGit2,
        keywords: ['project', 'app', 'code', 'github', p.title, ...p.techStack],
        action: () => {
          if (p.caseStudy) {
            openCaseStudyModal(p._id)
          } else if (p.liveUrl) {
            onClose()
            window.open(p.liveUrl, '_blank')
          } else {
            navigateToSection('projects')
          }
        },
      })),

      // ── Technical Blog Posts ───────────────────────────────────────────────
      ...STATIC_BLOGS.map((b) => ({
        id: `blog-${b._id}`,
        title: b.title,
        subtitle: `${b.readTime} min read • Technical Article`,
        Icon: BookOpen,
        keywords: ['blog', 'article', 'post', 'essay', b.title, ...b.tags],
        action: () => {
          onClose()
          navigate(`/blog/${b.slug}`)
        },
      })),

      // ── Quick Navigation ───────────────────────────────────────────────────
      {
        id: 'nav-home',
        title: 'Home',
        subtitle: 'Back to hero section & overview',
        Icon: Home,
        keywords: ['start', 'hero', 'top'],
        action: () => navigateToSection('home'),
      },
      {
        id: 'nav-about',
        title: 'About Me',
        subtitle: 'Background, philosophy & core principles',
        Icon: User,
        keywords: ['bio', 'skills', 'background', 'philosophy'],
        action: () => navigateToSection('about'),
      },
      {
        id: 'nav-projects',
        title: 'Projects Showcase',
        subtitle: 'Browse all full-stack applications & demos',
        Icon: FolderGit2,
        keywords: ['work', 'portfolio', 'apps', 'github'],
        action: () => navigateToSection('projects'),
      },
      {
        id: 'nav-experience',
        title: 'Experience Timeline',
        subtitle: 'Milestones, hackathons & education',
        Icon: GraduationCap,
        keywords: ['journey', 'timeline', 'sih', 'leetcode', 'college'],
        action: () => navigateToSection('experience'),
      },
      {
        id: 'nav-blog',
        title: 'Engineering Blog',
        subtitle: 'Architecture deep-dives & full-stack insights',
        Icon: BookOpen,
        keywords: ['articles', 'writing', 'posts', 'ai'],
        action: () => {
          onClose()
          navigate('/blog')
        },
      },
      {
        id: 'nav-resume',
        title: 'Resume & Credentials',
        subtitle: 'View official PDF resume & achievements',
        Icon: FileText,
        keywords: ['cv', 'experience', 'download', 'pdf', 'hire'],
        action: () => {
          onClose()
          navigate('/resume')
        },
      },
      {
        id: 'nav-contact',
        title: 'Get In Touch',
        subtitle: 'Send an inquiry or discuss collaboration',
        Icon: Mail,
        keywords: ['contact', 'hire', 'email', 'message'],
        action: () => navigateToSection('contact'),
      },

      // ── System & Actions ───────────────────────────────────────────────────
      {
        id: 'action-theme',
        title: `Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`,
        subtitle: 'Toggle site appearance theme',
        Icon: resolvedTheme === 'dark' ? Sun : Moon,
        keywords: ['theme', 'dark', 'light', 'mode'],
        action: () => {
          setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
          onClose()
        },
      },
      {
        id: 'action-telemetry',
        title: 'System Telemetry & Health',
        subtitle: 'Live API latency & operational diagnostics',
        Icon: Activity,
        keywords: ['telemetry', 'health', 'diagnostics', 'status', 'ping'],
        action: () => {
          onClose()
          window.dispatchEvent(new CustomEvent('open-telemetry'))
        },
      },
      {
        id: 'action-email',
        title: 'Copy Email Address',
        subtitle: 'alokhotta10@gmail.com',
        Icon: Copy,
        keywords: ['copy', 'email', 'contact', 'address'],
        action: () => {
          navigator.clipboard.writeText('alokhotta10@gmail.com')
          toast.success('Email copied to clipboard!')
          onClose()
        },
      },
      {
        id: 'action-resume-download',
        title: 'Download Resume PDF',
        subtitle: 'Save latest verified resume file',
        Icon: Download,
        keywords: ['resume', 'cv', 'pdf', 'download'],
        action: () => {
          onClose()
          const a = document.createElement('a')
          a.href = '/resume.pdf'
          a.download = 'Alok_Hotta_Resume.pdf'
          a.click()
        },
      },
      {
        id: 'action-github',
        title: 'View GitHub Profile',
        subtitle: 'github.com/iamalok123',
        Icon: ExternalLink,
        keywords: ['github', 'code', 'git', 'repos'],
        action: () => {
          onClose()
          window.open('https://github.com/iamalok123', '_blank')
        },
      },
    ]

    return list
  }, [navigate, navigateToSection, onClose, openCaseStudyModal, resolvedTheme, setTheme])

  // Filter items by multi-token query
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim()
    const tokens = q.split(/\s+/).filter(Boolean)

    if (tokens.length === 0) return items

    return items.filter((item) => {
      const searchTarget = [
        item.title,
        item.subtitle ?? '',
        ...(item.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase()

      return tokens.every((token) => searchTarget.includes(token))
    })
  }, [items, query])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action()
      }
    }
  }

  // Auto-scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  return (
    <Dialog.Root modal={false} open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Dark glassmorphic blurred backdrop */}
            <motion.div
              ref={backdropRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              style={{
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
              className="fixed inset-0 z-100 bg-black/60 dark:bg-black/75 cursor-pointer"
            />

            <div
              ref={wrapperRef}
              data-lenis-prevent
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  onClose()
                }
              }}
              className="fixed inset-0 z-101 flex items-start justify-center p-4 pt-16 sm:pt-24 pointer-events-auto"
            >
              <Dialog.Content asChild>
                <motion.div
                  ref={cardRef}
                  initial={{ opacity: 0, scale: 0.96, y: -12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -12 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  data-lenis-prevent
                  className="relative flex max-h-[85vh] min-h-0 w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                  onKeyDown={handleKeyDown}
                >
                  {/* Search Bar Input */}
                  <div className="flex items-center border-b border-border px-4 py-3.5 shrink-0">
                    <Search size={18} className="text-muted shrink-0 mr-3" />
                    <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
                    <Dialog.Description className="sr-only">
                      Search projects, case studies, blog posts, or actions
                    </Dialog.Description>
                    <input
                      ref={inputRef}
                      autoFocus
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search projects, articles, or commands..."
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="mr-2 text-muted hover:text-foreground cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <kbd className="hidden sm:inline rounded bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted border border-border">
                      ESC
                    </kbd>
                  </div>

                  {/* Results List */}
                  <div
                    ref={listRef}
                    data-lenis-prevent
                    tabIndex={0}
                    className="flex-1 min-h-0 max-h-[58vh] overflow-y-auto overscroll-contain p-2 divide-y divide-border/20 custom-scrollbar focus:outline-none"
                  >
                    {filteredItems.length === 0 ? (
                      <div className="py-12 text-center text-sm text-muted">
                        <p className="font-semibold text-foreground">No matching results found</p>
                        <p className="mt-1 text-xs text-muted">
                          Try searching for &ldquo;StudyFlow&rdquo;, &ldquo;Case Study&rdquo;, or &ldquo;Resume&rdquo;.
                        </p>
                      </div>
                    ) : (
                      filteredItems.map((item, index) => {
                        const isSelected = index === selectedIndex
                        const { Icon } = item

                        return (
                          <div
                            key={item.id}
                            data-index={index}
                            onClick={() => item.action()}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={cn(
                              'group flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors text-sm',
                              isSelected
                                ? 'bg-surface-2 text-foreground font-medium'
                                : 'text-muted hover:text-foreground'
                            )}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span
                                className={cn(
                                  'grid size-8 shrink-0 place-items-center rounded-lg border transition-colors',
                                  isSelected
                                    ? 'border-accent bg-accent/10 text-accent'
                                    : 'border-border bg-surface-2/60 text-muted group-hover:text-foreground'
                                )}
                              >
                                <Icon size={16} />
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-foreground text-sm font-semibold">
                                  {item.title}
                                </p>
                                {item.subtitle && (
                                  <p className="truncate text-xs text-muted mt-0.5">
                                    {item.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              {isSelected ? (
                                <ArrowUpRight size={15} className="text-accent shrink-0" />
                              ) : (
                                <span className="w-3.5" />
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Command Palette Footer */}
                  <div className="flex items-center justify-between border-t border-border bg-surface-2/40 px-4 py-2.5 text-[11px] text-muted font-mono shrink-0">
                    <div className="flex items-center gap-3">
                      <span>
                        <kbd className="rounded bg-surface px-1.5 py-0.5 border border-border text-[10px]">↑↓</kbd> navigate
                      </span>
                      <span>
                        <kbd className="rounded bg-surface px-1.5 py-0.5 border border-border text-[10px]">↵</kbd> select
                      </span>
                      <span>
                        <kbd className="rounded bg-surface px-1.5 py-0.5 border border-border text-[10px]">esc</kbd> close
                      </span>
                    </div>
                    <span className="hidden sm:inline text-muted/80">
                      {filteredItems.length} {filteredItems.length === 1 ? 'command' : 'commands'}
                    </span>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
