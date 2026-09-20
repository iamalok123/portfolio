import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Filter,
  FolderGit2,
  GraduationCap,
  Home,
  Mail,
  Moon,
  Search,
  Sparkles,
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

export interface CommandItem {
  id: string
  title: string
  subtitle?: string
  category: 'Navigation' | 'Projects' | 'Actions & Tools'
  Icon: LucideIcon
  action: () => void
  keywords?: string[]
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
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

  const items: CommandItem[] = useMemo(
    () => [
      // ── Navigation ────────────────────────────────────────────────────────
      {
        id: 'nav-home',
        title: 'Home',
        subtitle: 'Back to portfolio top hero',
        category: 'Navigation',
        Icon: Home,
        keywords: ['start', 'hero', 'top'],
        action: () => navigateToSection('home'),
      },
      {
        id: 'nav-about',
        title: 'About Me',
        subtitle: 'Bio, philosophy & engineering principles',
        category: 'Navigation',
        Icon: User,
        keywords: ['bio', 'skills', 'background'],
        action: () => navigateToSection('about'),
      },
      {
        id: 'nav-projects',
        title: 'Projects',
        subtitle: 'Browse all 14 full-stack & AI projects',
        category: 'Navigation',
        Icon: FolderGit2,
        keywords: ['work', 'portfolio', 'apps', 'github'],
        action: () => navigateToSection('projects'),
      },
      {
        id: 'nav-experience',
        title: 'Experience Timeline',
        subtitle: 'Milestones, hackathon victories & degrees',
        category: 'Navigation',
        Icon: GraduationCap,
        keywords: ['journey', 'timeline', 'sih', 'leetcode', 'college'],
        action: () => navigateToSection('experience'),
      },
      {
        id: 'nav-blog',
        title: 'Technical Blog',
        subtitle: 'Engineering deep-dives & architecture essays',
        category: 'Navigation',
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
        subtitle: 'View official PDF resume & certifications',
        category: 'Navigation',
        Icon: FileText,
        keywords: ['cv', 'experience', 'download', 'pdf', 'hire'],
        action: () => {
          onClose()
          navigate('/resume')
        },
      },
      {
        id: 'nav-contact',
        title: 'Contact / Hire Me',
        subtitle: 'Send a message or get in touch',
        category: 'Navigation',
        Icon: Mail,
        keywords: ['email', 'hire', 'message', 'inbox'],
        action: () => {
          onClose()
          navigate('/contact')
        },
      },

      // ── Project Filters ───────────────────────────────────────────────────
      {
        id: 'filter-ai',
        title: 'Filter: AI & LLM Systems',
        subtitle: 'Zephyr, StudyFlow, Social AI, CareIQ',
        category: 'Projects',
        Icon: Sparkles,
        keywords: ['ai', 'gemini', 'rag', 'llm', 'inngest'],
        action: () => {
          navigateToSection('projects')
          // Trigger custom event or dispatch if needed
          window.dispatchEvent(new CustomEvent('filter-projects', { detail: 'AI' }))
        },
      },
      {
        id: 'filter-nextjs',
        title: 'Filter: Next.js Projects',
        subtitle: 'Dev Events, Social AI Next.js 16',
        category: 'Projects',
        Icon: Filter,
        keywords: ['next', 'nextjs', 'react', 'tailwind'],
        action: () => {
          navigateToSection('projects')
          window.dispatchEvent(new CustomEvent('filter-projects', { detail: 'Next.js' }))
        },
      },
      {
        id: 'filter-fullstack',
        title: 'Filter: Full-Stack PERN & MERN',
        subtitle: 'PostgreSQL, Node.js, Express, MongoDB',
        category: 'Projects',
        Icon: Code2,
        keywords: ['pern', 'mern', 'node', 'express', 'database'],
        action: () => {
          navigateToSection('projects')
          window.dispatchEvent(new CustomEvent('filter-projects', { detail: 'Node.js' }))
        },
      },

      // ── Actions & Tools ───────────────────────────────────────────────────
      {
        id: 'action-theme',
        title: `Switch Theme to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`,
        subtitle: 'Toggle dynamic interface colors',
        category: 'Actions & Tools',
        Icon: resolvedTheme === 'dark' ? Sun : Moon,
        keywords: ['theme', 'dark', 'light', 'mode'],
        action: () => {
          setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
          toast.success(`Switched to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`)
          onClose()
        },
      },
      {
        id: 'action-cal',
        title: 'Schedule a 15-Minute Intro Call',
        subtitle: 'Direct booking on Cal.com',
        category: 'Actions & Tools',
        Icon: Calendar,
        keywords: ['calendar', 'call', 'meeting', 'cal.com', 'schedule'],
        action: () => {
          onClose()
          window.open('https://cal.com/alok-hotta', '_blank')
        },
      },
      {
        id: 'action-email',
        title: 'Copy Email Address',
        subtitle: 'alokhotta10@gmail.com',
        category: 'Actions & Tools',
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
        subtitle: 'Get latest resume file (135 KB)',
        category: 'Actions & Tools',
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
        category: 'Actions & Tools',
        Icon: ExternalLink,
        keywords: ['github', 'code', 'git', 'repos'],
        action: () => {
          onClose()
          window.open('https://github.com/iamalok123', '_blank')
        },
      },
    ],
    [navigateToSection, navigate, onClose, resolvedTheme, setTheme]
  )

  // Filter items by query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items

    const q = query.toLowerCase().trim()
    return items.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q)
      const matchSubtitle = item.subtitle?.toLowerCase().includes(q)
      const matchCategory = item.category.toLowerCase().includes(q)
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q))
      return matchTitle || matchSubtitle || matchCategory || matchKeywords
    })
  }, [items, query])

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredItems])

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
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md"
              />
            </Dialog.Overlay>

            <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -12 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                  onKeyDown={handleKeyDown}
                >
                  {/* Search Bar Input */}
                  <div className="flex items-center border-b border-border px-4 py-3.5">
                    <Search size={18} className="text-muted shrink-0 mr-3" />
                    <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
                    <Dialog.Description className="sr-only">
                      Search commands, navigate sections, or filter projects
                    </Dialog.Description>
                    <input
                      ref={inputRef}
                      autoFocus
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Type a command or search..."
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="mr-2 text-muted hover:text-foreground"
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
                    className="max-h-80 overflow-y-auto p-2 divide-y divide-border/30"
                  >
                    {filteredItems.length === 0 ? (
                      <div className="py-10 text-center text-sm text-muted">
                        No matching commands found for &ldquo;{query}&rdquo;
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
                              'group flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 transition-all text-sm',
                              isSelected
                                ? 'bg-surface-2 text-foreground font-medium shadow-xs'
                                : 'text-muted hover:text-foreground'
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={cn(
                                  'grid size-8 shrink-0 place-items-center rounded-lg border transition-colors',
                                  isSelected
                                    ? 'border-accent bg-accent/10 text-accent'
                                    : 'border-border bg-surface text-muted group-hover:text-foreground'
                                )}
                              >
                                <Icon size={16} />
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-foreground text-xs sm:text-sm font-semibold">
                                  {item.title}
                                </p>
                                {item.subtitle && (
                                  <p className="truncate text-[11px] text-muted">
                                    {item.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <span className="hidden sm:inline-block rounded-full bg-surface-2 border border-border/50 px-2 py-0.5 text-[10px] font-mono text-muted">
                                {item.category}
                              </span>
                              {isSelected && (
                                <ArrowUpRight size={14} className="text-accent" />
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Command Palette Footer */}
                  <div className="flex items-center justify-between border-t border-border bg-surface-2/40 px-4 py-2.5 text-[11px] text-muted font-mono">
                    <div className="flex items-center gap-3">
                      <span><kbd className="rounded bg-surface px-1 py-0.5 border border-border">↑↓</kbd> navigate</span>
                      <span><kbd className="rounded bg-surface px-1 py-0.5 border border-border">↵</kbd> select</span>
                      <span><kbd className="rounded bg-surface px-1 py-0.5 border border-border">esc</kbd> close</span>
                    </div>
                    <span className="hidden sm:inline">alokhotta.site</span>
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
