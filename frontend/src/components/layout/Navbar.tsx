import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'

const navItems = [
  { label: 'Home', sectionId: 'home' },
  { label: 'About', sectionId: 'about' },
  { label: 'Projects', sectionId: 'projects' },
  { label: 'Blog', sectionId: 'blog' },
  { label: 'Contact', sectionId: 'contact' },
  { label: 'Resume', path: '/resume' },
] as const

type NavItem = (typeof navItems)[number]

// ─── Lenis scroll-to helper ─────────────────────────────────────────────────
// App.tsx exposes the Lenis instance on window.lenis.
// We use lenis.scrollTo(element) for perfectly smooth, physics-based scrolling.
// Fall back to scrollIntoView if Lenis hasn't initialised yet (rare).
function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const lenis = (window as Window & { lenis?: { scrollTo: (target: HTMLElement | string, opts?: object) => void } }).lenis

  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}


// ─── Theme Toggle ────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  return (
    <motion.button
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      animate={{ rotate: isDark ? 0 : 360 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="relative grid size-11 place-items-center rounded-full border border-border bg-surface/80 text-foreground shadow-sm backdrop-blur-md transition hover:border-accent/50"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  // Store a pending scroll target when we navigate to '/' from another page
  const pendingScroll = useRef<string | null>(null)

  const isOnHome = location.pathname === '/'

  // Derive active section for non-home pages
  const displayActiveSection = location.pathname.startsWith('/blog')
    ? 'blog'
    : location.pathname.startsWith('/resume')
      ? 'resume'
      : location.pathname.startsWith('/project')
        ? 'projects'
        : activeSection

  // ── Scroll header background ───────────────────────────────────────────────
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50)
  })

  // ── Scroll Listener for active section ─────────────────────────────────────
  useEffect(() => {
    if (!isOnHome) return

    const handleScroll = () => {
      const sections = navItems
        .filter((item) => 'sectionId' in item)
        .map((item) => document.getElementById(item.sectionId))
        .filter((s): s is HTMLElement => Boolean(s))

      if (!sections.length) return

      let currentSection = 'home'

      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        // If the top of the section crosses the upper 35% of the screen,
        // it becomes the active section. Iterating top-to-bottom ensures
        // the deepest visible section wins.
        if (rect.top <= window.innerHeight * 0.35) {
          currentSection = section.id
        }
      }

      setActiveSection(currentSection)
    }

    // Run once on mount
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isOnHome])

  // ── Execute pending scroll after navigating to home ──────────────────────
  useEffect(() => {
    if (isOnHome && pendingScroll.current) {
      const id = pendingScroll.current
      pendingScroll.current = null
      // Wait one tick so Home's sections are rendered before we scroll
      const timer = setTimeout(() => scrollToSection(id), 100)
      return () => clearTimeout(timer)
    }
  }, [isOnHome])

  // ── Lock body scroll when mobile menu is open ─────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  // ── Handle nav link clicks ─────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault()
      setIsMobileOpen(false)

      if (isOnHome) {
        // Already on home → just scroll to the section
        scrollToSection(sectionId)
      } else {
        // On another page → store scroll target and navigate to home
        pendingScroll.current = sectionId
        navigate('/')
      }
    },
    [isOnHome, navigate],
  )

  const handleRouteClick = useCallback((e: React.MouseEvent, path: string) => {
    e.preventDefault()
    setIsMobileOpen(false)
    navigate(path)
  }, [navigate])

  // ── Nav background ────────────────────────────────────────────────────────
  const navBackground = useMemo(
    () =>
      isScrolled
        ? 'border-border bg-surface/80 shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur-md'
        : 'border-transparent bg-transparent',
    [isScrolled],
  )

  // ── Render a single desktop nav link ──────────────────────────────────────
  const renderNavLink = (item: NavItem, index: number) => {
    const isRouteItem = 'path' in item
    const activeKey = isRouteItem ? item.path.replace('/', '') : item.sectionId
    const isActive = displayActiveSection === activeKey

    return (
      <motion.a
        key={item.label}
        href={isRouteItem ? item.path : `/#${item.sectionId}`}
        onClick={(e) =>
          isRouteItem ? handleRouteClick(e, item.path) : handleNavClick(e, item.sectionId)
        }
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'group relative py-2 text-sm font-medium text-muted transition-colors hover:text-foreground',
          isActive && 'text-accent',
        )}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24, delay: index * 0.02 }}
      >
        {item.label}
        <span
          className={cn(
            'absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100',
            isActive ? 'scale-x-100' : 'scale-x-0'
          )}
        />
      </motion.a>
    )
  }

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        aria-label="Main navigation"
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
          navBackground,
        )}
      >
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
          <Link
            to="/"
            className="font-display text-xl font-extrabold tracking-normal text-foreground"
            aria-label="Go to home"
          >
            <span className="text-accent">[</span>alokhotta.site
            <span className="text-accent">]</span>
          </Link>

          <div className="hidden items-center gap-8 rounded-full border border-border bg-surface/45 px-7 py-2.5 backdrop-blur-md lg:flex">
            {navItems.map(renderNavLink)}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <motion.a
              href="/#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 360, damping: 22 }}
              style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-display text-xs font-extrabold uppercase tracking-[0.18em]"
            >
              Hire Me
              <ArrowUpRight size={16} />
            </motion.a>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <motion.button
              type="button"
              aria-label="Open menu"
              onClick={() => setIsMobileOpen(true)}
              whileTap={{ scale: 0.94 }}
              className="grid size-11 place-items-center rounded-full border border-border bg-surface/80 text-foreground backdrop-blur-md"
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile full-screen overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            className="fixed inset-0 z-60 bg-bg/96 px-6 py-6 backdrop-blur-xl lg:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="font-display text-xl font-extrabold text-foreground">
                <span className="text-accent">[</span>alokhotta.site
                <span className="text-accent">]</span>
              </Link>
              <motion.button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileOpen(false)}
                whileTap={{ scale: 0.94 }}
                className="grid size-11 place-items-center rounded-full border border-border bg-surface text-foreground"
              >
                <X size={20} />
              </motion.button>
            </div>

            <motion.div
              className="mt-20 flex flex-col gap-5"
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
                closed: {},
              }}
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={'path' in item ? item.path : `/#${item.sectionId}`}
                  onClick={(e) =>
                    'path' in item
                      ? handleRouteClick(e, item.path)
                      : handleNavClick(e, item.sectionId)
                  }
                  variants={{
                    closed: { opacity: 0, x: 42 },
                    open: { opacity: 1, x: 0 },
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className={cn(
                    'border-b border-border pb-5 font-display text-4xl font-extrabold text-foreground',
                    displayActiveSection === ('path' in item ? item.path.replace('/', '') : item.sectionId) &&
                      'text-accent',
                  )}
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.div>

            <motion.a
              href="/#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.5 }}
              style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
              className="mt-12 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 font-display text-sm font-extrabold uppercase tracking-[0.18em]"
            >
              Hire Me
              <ArrowUpRight size={18} />
            </motion.a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
