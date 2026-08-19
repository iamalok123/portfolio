import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'

export function WorkTogetherCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section
      ref={ref}
      aria-label="Work Together Call to Action"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="relative flex flex-col items-center justify-center text-center">
          {/* Status pill: Available for projects */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-surface/80 px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-muted sm:text-xs">
              Available for projects
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 160, damping: 24, delay: 0.1 }}
            className="mt-8 w-full max-w-5xl sm:mt-10"
          >
            <h2 className="font-display text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
              Let&apos;s work
            </h2>

            <div className="relative mt-2 flex w-full items-center justify-center sm:mt-3">
              {/* Left horizontal line */}
              <div className="hidden h-px flex-1 bg-border md:block" />

              <span className="px-4 font-display text-5xl font-extrabold tracking-tight text-muted/60 sm:text-7xl md:px-8 md:text-8xl lg:text-9xl dark:text-neutral-500">
                together
              </span>

              {/* Right horizontal line */}
              <div className="hidden h-px flex-1 bg-border md:block" />
            </div>
          </motion.div>

          {/* Circular hover CTA button - activates strictly when hovering the circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            className="mt-10 sm:mt-14"
          >
            <Link
              to="/contact"
              aria-label="Let's work together - Contact Alok Hotta"
              className="group/btn relative grid size-16 place-items-center rounded-full border border-border bg-surface-2 text-foreground shadow-sm transition-all duration-300 ease-out hover:scale-110 hover:border-transparent hover:bg-white hover:text-black hover:shadow-[0_12px_40px_rgba(0,0,0,0.24)] focus:outline-none dark:bg-[#141414] dark:text-white dark:hover:bg-white dark:hover:text-black dark:hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] sm:size-20"
            >
              <ArrowUpRight
                size={28}
                className="text-foreground transition-all duration-300 ease-out group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:scale-110 group-hover/btn:text-black dark:text-white dark:group-hover/btn:text-black"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
