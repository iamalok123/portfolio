import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SKILL_GROUPS, SKILL_ORBIT } from '../../data/skills'

function TechGlyph({ glyph = 'square', mark }: { glyph?: string; mark: string }) {
  if (glyph === 'react') {
    return (
      <svg viewBox="0 0 32 32" className="size-4" aria-hidden="true">
        <circle cx="16" cy="16" r="2.4" fill="currentColor" />
        <ellipse cx="16" cy="16" rx="12" ry="4.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <ellipse
          cx="16"
          cy="16"
          rx="12"
          ry="4.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          transform="rotate(60 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="12"
          ry="4.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          transform="rotate(120 16 16)"
        />
      </svg>
    )
  }

  if (glyph === 'tailwind') {
    return (
      <svg viewBox="0 0 32 32" className="size-4" aria-hidden="true">
        <path
          d="M8 13.5c2-5.3 5.4-7.2 10.2-5.6 2.8.9 4.8 3 6.8 3.3 2 .3 3.6-.6 5-2.7-2 5.3-5.4 7.2-10.2 5.6-2.8-.9-4.8-3-6.8-3.3-2-.3-3.6.6-5 2.7Zm-6 9c2-5.3 5.4-7.2 10.2-5.6 2.8.9 4.8 3 6.8 3.3 2 .3 3.6-.6 5-2.7-2 5.3-5.4 7.2-10.2 5.6-2.8-.9-4.8-3-6.8-3.3-2-.3-3.6.6-5 2.7Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (glyph === 'node') {
    return (
      <svg viewBox="0 0 32 32" className="size-4" aria-hidden="true">
        <path
          d="M16 2.8 27.4 9.4v13.2L16 29.2 4.6 22.6V9.4L16 2.8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M11 20.2V12h2.1l5.8 5.8V12H21v8.2h-2.1l-5.8-5.8v5.8H11Z" fill="currentColor" />
      </svg>
    )
  }

  if (glyph === 'docker') {
    return (
      <svg viewBox="0 0 32 32" className="size-4" aria-hidden="true">
        <path d="M6 16h4v4H6v-4Zm5 0h4v4h-4v-4Zm5 0h4v4h-4v-4Zm-5-5h4v4h-4v-4Zm5 0h4v4h-4v-4Zm5 5h4v4h-4v-4Z" fill="currentColor" />
        <path d="M4 21h22.5c-.8 4.1-4.2 6.2-10.1 6.2H12C7.3 27.2 4.7 25.2 4 21Z" fill="currentColor" />
        <path d="M25 14c2 0 3.4.8 4.2 2.3-1.6.5-3.1.4-4.5-.2L25 14Z" fill="currentColor" />
      </svg>
    )
  }

  if (glyph === 'mongodb') {
    return (
      <svg viewBox="0 0 32 32" className="size-4" aria-hidden="true">
        <path
          d="M16 2c5 4.4 7.4 8.5 7.2 12.5-.2 5-3.4 8.9-6.1 11.2L16 30l-1.1-4.3c-2.8-2.4-6-6.3-6.1-11.2C8.6 10.5 11 6.4 16 2Z"
          fill="currentColor"
        />
        <path d="M16 6v20" stroke="var(--bg)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }

  if (glyph === 'vercel') {
    return (
      <svg viewBox="0 0 32 32" className="size-4" aria-hidden="true">
        <path d="M16 5 30 27H2L16 5Z" fill="currentColor" />
      </svg>
    )
  }

  if (glyph === 'git') {
    return (
      <svg viewBox="0 0 32 32" className="size-4" aria-hidden="true">
        <path d="M16 3 29 16 16 29 3 16 16 3Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
        <path d="M13.5 13.5 18.5 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  return <span className="font-mono text-[10px] font-bold uppercase tracking-normal">{mark}</span>
}

export function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 130, damping: 22 }}
          className="max-w-3xl"
        >
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-muted">
            // tech_stack
          </p>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-foreground sm:text-6xl">
            My Tech Stack
          </h2>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.06 } },
            hidden: {},
          }}
        >
          {SKILL_ORBIT.map(({ label, Icon }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-foreground/35"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-accent text-bg transition group-hover:scale-105">
                <Icon size={19} />
              </span>
              <span className="font-display text-sm font-bold uppercase tracking-[0.16em] text-foreground">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
            hidden: {},
          }}
        >
          {SKILL_GROUPS.map(({ category, skills, Icon }) => (
            <motion.div
              key={category}
              variants={{
                hidden: { opacity: 0, y: 26 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 21 }}
              className="flex min-h-full flex-col rounded-lg border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-foreground/35"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-2 text-foreground">
                  <Icon size={18} />
                </span>
                <h3 className="font-mono text-sm uppercase tracking-[0.22em] text-muted">
                  {category}
                </h3>
              </div>

              <motion.div
                className="grid gap-2.5 sm:grid-cols-2"
                variants={{
                  visible: { transition: { staggerChildren: 0.035 } },
                  hidden: {},
                }}
              >
                {skills.map(({ label, mark, glyph }) => (
                  <motion.span
                    key={label}
                    variants={{
                      hidden: { opacity: 0, x: -10, scale: 0.96 },
                      visible: { opacity: 1, x: 0, scale: 1 },
                    }}
                    whileHover="hover"
                    transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                    className="group/skill inline-flex min-w-0 items-center gap-2 rounded-full border border-border bg-surface-2/70 px-3 py-2 text-sm font-medium text-foreground transition hover:border-foreground/45 hover:bg-bg"
                  >
                    <motion.span
                      variants={{ hover: { x: 2, scale: 1.04 } }}
                      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                      className="grid h-7 min-w-7 shrink-0 place-items-center rounded-full border border-border bg-bg px-1.5 font-mono text-[10px] font-bold uppercase tracking-normal text-foreground"
                    >
                      <TechGlyph glyph={glyph} mark={mark} />
                    </motion.span>
                    <motion.span
                      variants={{ hover: { x: 2 } }}
                      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                      className="truncate"
                    >
                      {label}
                    </motion.span>
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
