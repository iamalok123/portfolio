import { motion } from 'framer-motion'
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react'
import { Github, Linkedin, TwitterX } from 'react-bootstrap-icons'

export function Hero() {
  return (
    <section id="home" className="relative isolate min-h-svh overflow-hidden pt-20">
      <div className="hero-grain pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_22%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_28rem)]" />

      <div className="mx-auto grid min-h-[calc(100svh-8.75rem)] w-full max-w-7xl items-center gap-10 px-6 pb-10 pt-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-14 lg:mt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {},
          }}
          className="mx-auto w-full max-w-3xl text-center lg:mx-0 lg:text-left"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="inline-flex max-w-full items-center justify-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted sm:text-xs lg:justify-start"
          >
            <span className="truncate">Working remotely from Bhubaneswar, India</span>
            <span className="h-4 w-0.5 shrink-0 animate-pulse bg-accent" />
          </motion.p>

          <h1
            aria-label="HAY, I'M ALOK HOTTA"
            className="mt-6 max-w-4xl font-display font-extrabold uppercase leading-[0.9] tracking-normal text-foreground"
          >
            <motion.span
              aria-hidden="true"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 170, damping: 20 }}
              className="block text-4xl sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              HAY, I'M
            </motion.span>
            <span className="mt-2 block sm:mt-3">
              <motion.span
                aria-hidden="true"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ type: 'spring', stiffness: 170, damping: 20 }}
                className="relative inline-block text-5xl sm:text-7xl lg:text-8xl xl:text-[6.8rem]"
              >
                ALOK
                <motion.svg
                  viewBox="0 0 260 22"
                  className="absolute -bottom-1 left-0 h-3 w-full text-accent sm:-bottom-2 sm:h-4"
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
              </motion.span>
              <motion.span
                aria-hidden="true"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ type: 'spring', stiffness: 170, damping: 20 }}
                className="ml-0 mt-2 block text-5xl sm:text-7xl lg:ml-4 lg:mt-0 lg:inline-block lg:text-8xl xl:text-[6.8rem]"
              >
                HOTTA
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 180, damping: 22 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted sm:text-xl sm:leading-8 lg:mx-0"
          >
            Full-Stack AI Developer building scalable product solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 180, damping: 22 }}
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start"
          >
            <a
              href="#projects"
              style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em] transition hover:scale-105"
            >
              View Projects
              <ArrowUpRight size={18} />
            </a>
            <a
              href="/resume.pdf"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/60 px-6 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-foreground transition hover:bg-surface-2"
            >
              Download Resume
              <ArrowDownToLine size={18} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, type: 'spring', stiffness: 180, damping: 22 }}
            className="mt-6 flex items-center justify-center gap-3 lg:justify-start"
          >
            {[
              { label: 'GitHub', href: 'https://github.com/alok', Icon: Github },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/alok', Icon: Linkedin },
              { label: 'X', href: 'https://x.com', Icon: TwitterX },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
                className="grid size-12 place-items-center rounded-md transition hover:-translate-y-1"
              >
                <Icon size={20} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 140, damping: 18 }}
          className="relative mx-auto w-full max-w-md lg:justify-self-end"
        >
          <img
            src="/photo.png"
            alt="Alok Hotta"
            className="mx-auto aspect-3/4 max-h-[66svh] w-full max-w-sm rounded-2xl border border-border object-cover object-[center_5%] grayscale shadow-[0_24px_90px_rgba(0,0,0,0.22)]"
          />
        </motion.div>
      </div>

      <div className="overflow-hidden bg-accent py-4 text-bg">
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
