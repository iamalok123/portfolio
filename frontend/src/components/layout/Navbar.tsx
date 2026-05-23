import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'

const navItems = [
  { label: 'Home', href: '/#home', sectionId: 'home' },
  { label: 'About', href: '/#about', sectionId: 'about' },
  { label: 'Projects', href: '/#projects', sectionId: 'projects' },
  { label: 'Blog', href: '/#blog', sectionId: 'blog' },
  { label: 'Contact', href: '/#contact', sectionId: 'contact' },
]

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

export function Navbar() {
  const location = useLocation()
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const displayActiveSection = location.pathname.startsWith('/blog')
    ? 'blog'
    : location.pathname.startsWith('/projects')
      ? 'projects'
      : activeSection

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50)
  })

  useEffect(() => {
    if (location.pathname !== '/') {
      return
    }

    const sections = navItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((section): section is HTMLElement => Boolean(section))

    if (!sections.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: [0.1, 0.35, 0.6],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const navBackground = useMemo(
    () =>
      isScrolled
        ? 'border-border bg-surface/80 shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur-md'
        : 'border-transparent bg-transparent',
    [isScrolled],
  )

  const renderNavLink = (item: (typeof navItems)[number], index: number) => {
    const isActive = displayActiveSection === item.sectionId

    return (
      <motion.a
        key={item.sectionId}
        href={item.href}
        className={cn(
          'group relative py-2 text-sm font-medium text-muted transition-colors hover:text-foreground',
          isActive && 'text-accent',
        )}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24, delay: index * 0.02 }}
      >
        {item.label}
        <motion.span
          className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent"
          initial={false}
          animate={{ scaleX: isActive ? 1 : 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
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
            <span className="text-accent">[</span>alok.dev
            <span className="text-accent">]</span>
          </Link>

          <div className="hidden items-center gap-8 rounded-full border border-border bg-surface/45 px-7 py-2.5 backdrop-blur-md lg:flex">
            {navItems.map(renderNavLink)}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 360, damping: 22 }}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-display text-xs font-extrabold uppercase tracking-[0.18em] text-black"
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

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            className="fixed inset-0 z-[60] bg-bg/96 px-6 py-6 backdrop-blur-xl lg:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="font-display text-xl font-extrabold text-foreground">
                <span className="text-accent">[</span>alok.dev
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
                  key={item.sectionId}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  variants={{
                    closed: { opacity: 0, x: 42 },
                    open: { opacity: 1, x: 0 },
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className={cn(
                    'border-b border-border pb-5 font-display text-4xl font-extrabold text-foreground',
                    displayActiveSection === item.sectionId && 'text-accent',
                  )}
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.div>

            <motion.a
              href="/#contact"
              onClick={() => setIsMobileOpen(false)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.5 }}
              className="mt-12 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 font-display text-sm font-extrabold uppercase tracking-[0.18em] text-black"
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
