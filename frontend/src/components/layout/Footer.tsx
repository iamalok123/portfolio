import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, BriefcaseBusiness, MessagesSquare } from 'lucide-react'
import { Github } from 'react-bootstrap-icons'
import type { ComponentType } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'

const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contact', href: '/#contact' },
]

const SOCIAL_LINKS: { label: string; href: string; Icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { label: 'GitHub', href: 'https://github.com', Icon: Github as ComponentType<{ size?: number; className?: string }> },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: BriefcaseBusiness },
  { label: 'Twitter', href: 'https://x.com', Icon: MessagesSquare },
  {
    label: 'LeetCode',
    href: 'https://leetcode.com',
    Icon: () => (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
  },
]

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  // Parallax for the giant background text
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  })
  const bgTextY = useTransform(scrollYProgress, [0, 1], ['20%', '-8%'])

  const setRefs = (node: HTMLElement | null) => {
    ; (footerRef as React.MutableRefObject<HTMLElement | null>).current = node
    inViewRef(node)
  }

  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      ref={setRefs}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 120, damping: 22 }}
      style={{ backgroundColor: '#0a0a0a' }}
      className="relative overflow-hidden border-t border-white/5"
    >
      {/* Giant parallax background text */}
      <motion.p
        style={{ y: bgTextY }}
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[clamp(5rem,18vw,14rem)] font-extrabold uppercase leading-none tracking-tight text-white/4"
        aria-hidden="true"
      >
        OPEN TO WORK
      </motion.p>

      {/* ── Main footer content ─────────────────────────────────────────── */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        {/* Top row: logo | nav links | social icons */}
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-2xl font-extrabold tracking-normal text-white"
            aria-label="Go to home"
          >
            <span className="text-accent">[</span>alok.dev
            <span className="text-accent">]</span>
          </Link>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-6 sm:gap-8">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    whileHover={{ color: 'var(--accent)' }}
                    className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-accent"
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social icon buttons */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                className="grid size-10 place-items-center rounded-md border border-white/10 bg-white/5 text-white/50 transition hover:border-accent/50 hover:text-accent"
              >
                <Icon />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-white/5" />

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-white/35">
            Designed &amp; Built by{' '}
            <span className="font-semibold text-white/55">Alok Kumar</span>
          </p>

          <p className="text-sm text-white/35">
            Made with{' '}
            <span className="text-accent">React</span>
            {' '}+{' '}
            <span aria-label="love">❤️</span>
          </p>

          <div className="flex items-center gap-4">
            <p className="text-sm text-white/35">© {currentYear}</p>
            <motion.a
              href="/#home"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/40 transition hover:border-accent/40 hover:text-accent"
            >
              Back to top
              <ArrowUpRight size={13} />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
