import { motion } from 'framer-motion'
import {
  ArrowDownToLine,
  ArrowUpRight,
  BriefcaseBusiness,
  GitFork,
  MessagesSquare,
} from 'lucide-react'

const headingWords = ['HEY,', "I'M", 'Alok', 'Hotta.']
const badges = ['Knight @ LeetCode', 'SIH 2025 Winner', 'Open Source']

export function Hero() {
  return (
    <section id="home" className="relative isolate min-h-svh overflow-hidden pt-24">
      <div className="hero-grain pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_22%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_28rem)]" />

      <div className="mx-auto grid min-h-[calc(100svh-6rem)] w-full max-w-7xl items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {},
          }}
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.24em] text-muted"
          >
            Based in Bhubaneswar, India
            <span className="h-4 w-0.5 animate-pulse bg-accent" />
          </motion.p>

          <h1 className="mt-6 max-w-5xl font-display text-[clamp(3.4rem,13vw,7.5rem)] font-extrabold uppercase leading-[0.86] tracking-normal text-foreground">
            {headingWords.map((word, index) => (
              <motion.span
                key={word}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ type: 'spring', stiffness: 170, damping: 20 }}
                className="mr-5 inline-block"
              >
                {word}
                {index === 2 ? (
                  <motion.svg
                    viewBox="0 0 260 22"
                    className="mt-1 block h-4 w-full text-accent"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <motion.path
                      d="M4 15 C58 3 106 25 158 10 C197 -1 226 7 256 4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="8"
                    />
                  </motion.svg>
                ) : null}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 180, damping: 22 }}
            className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl"
          >
            Full-Stack Developer building scalable products for the web.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 180, damping: 22 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-black transition hover:scale-105"
            >
              View Projects
              <ArrowUpRight size={18} />
            </a>
            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-6 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-foreground transition hover:bg-accent hover:text-black"
            >
              Download Resume
              <ArrowDownToLine size={18} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, type: 'spring', stiffness: 180, damping: 22 }}
            className="mt-7 flex items-center gap-3"
          >
            {[
              { label: 'GitHub', href: 'https://github.com', Icon: GitFork },
              { label: 'LinkedIn', href: 'https://linkedin.com', Icon: BriefcaseBusiness },
              { label: 'Twitter', href: 'https://x.com', Icon: MessagesSquare },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="grid size-12 place-items-center rounded-md bg-accent text-black transition hover:-translate-y-1"
              >
                <Icon size={20} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 140, damping: 18 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -left-5 top-5 z-20 -rotate-6 bg-accent px-4 py-2 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-black shadow-xl">
            Engineer
          </div>
          <div className="relative rounded-2xl border border-border bg-surface p-4 shadow-[0_24px_90px_rgba(0,0,0,0.22)]">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ml-auto font-mono text-xs text-muted">alok.dev</span>
            </div>
            <div className="relative aspect-4/4.5 overflow-hidden rounded-xl border-4 border-accent bg-surface-2">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_45%),radial-gradient(circle_at_50%_20%,color-mix(in_srgb,var(--foreground)_14%,transparent),transparent_20rem)]" />
              <div className="absolute inset-x-10 bottom-0 h-[78%] rounded-t-full border border-accent/35 bg-bg shadow-[inset_0_0_60px_color-mix(in_srgb,var(--accent)_14%,transparent)]" />
              <div className="absolute left-1/2 top-[28%] size-24 -translate-x-1/2 rounded-full border-4 border-accent bg-surface" />
              <div className="absolute bottom-16 left-1/2 h-36 w-48 -translate-x-1/2 rounded-t-[5rem] border-4 border-accent bg-surface" />
            </div>
          </div>

          {badges.map((badge, index) => (
            <motion.span
              key={badge}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: index * 0.45,
                ease: 'easeInOut',
              }}
              className={[
                'absolute rounded-full border border-border bg-bg px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-xl',
                index === 0 ? '-right-2 top-20 rotate-3' : '',
                index === 1 ? '-left-4 bottom-28 -rotate-3' : '',
                index === 2 ? 'right-8 bottom-5 rotate-6' : '',
              ].join(' ')}
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="overflow-hidden bg-accent py-4 text-black">
        <div className="marquee-track flex w-max gap-10 font-display text-sm font-extrabold uppercase tracking-[0.24em]">
          {Array.from({ length: 2 }).map((_, index) => (
            <span key={index}>
              FULL-STACK DEVELOPER * REACT / NODE.JS * LEETCODE KNIGHT * SIH 2025 WINNER *
              OPEN SOURCE CONTRIBUTOR *
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
