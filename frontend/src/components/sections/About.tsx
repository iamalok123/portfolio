import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { ABOUT_CONTENT, ABOUT_STATS, CAPABILITIES } from '../../data/about'

interface CountUpProps {
  value: number
  suffix: string
  decimals?: number
  inView: boolean
}

function CountUp({ value, suffix, decimals = 0, inView }: CountUpProps) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef(0)

  useEffect(() => {
    // Cancel any in-progress animation
    cancelAnimationFrame(frameRef.current)

    if (!inView) return

    const duration = 1200
    let startTime: number | null = null

    const tick = (time: number) => {
      if (startTime === null) startTime = time
      const elapsed = time - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3)

      setDisplay(value * eased)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        // Ensure we always land exactly on the target value
        setDisplay(value)
      }
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameRef.current)
  }, [inView, value])

  // Format: decimals > 0 → toFixed, else Math.floor to avoid "0.9st Place"
  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.floor(display).toString()

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  )
}

export function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 130, damping: 22 }}
        >
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-accent">
            {ABOUT_CONTENT.label}
          </p>
          <h2 className="mt-5 whitespace-pre-line font-display text-4xl font-extrabold leading-[1.02] text-foreground sm:text-6xl">
            {ABOUT_CONTENT.heading}
          </h2>
          <div className="mt-7 space-y-5 text-base leading-8 text-muted sm:text-lg">
            {ABOUT_CONTENT.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex size-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(34,197,94,0.85)]" />
            </span>
            Currently Building
            <span className="font-display font-bold text-accent pl-8">{ABOUT_CONTENT.currentBuild}</span>
          </div>
        </motion.div>

        <div>
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {},
            }}
          >
            {ABOUT_STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                className="rounded-lg border border-border bg-surface-2 p-6 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_40px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
              >
                <p className="font-display text-4xl font-extrabold text-foreground">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    inView={inView}
                  />
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 grid gap-4"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
              hidden: {},
            }}
          >
            <h3 className="font-display text-2xl font-extrabold text-foreground">What I Do</h3>
            {CAPABILITIES.map(({ title, description, Icon }) => (
              <motion.div
                key={title}
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                className="group flex items-start gap-4 rounded-lg border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-l-accent"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-md bg-accent text-bg">
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">{title}</h4>
                  <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
