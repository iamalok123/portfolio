import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'

export function NotFound() {
  return (
    <PageTransition>
      <section className="relative isolate grid min-h-svh place-items-center overflow-hidden px-6 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glitch 404 */}
          <div className="relative inline-block" aria-label="404">
            <span
              className="glitch-text font-display text-[clamp(8rem,30vw,18rem)] font-extrabold leading-none text-foreground"
              data-text="404"
            >
              404
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-4 font-display text-2xl font-bold text-foreground sm:text-4xl"
          >
            Page not found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mx-auto mt-4 max-w-md text-base text-muted"
          >
            Looks like this page got lost in the void. Let's get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-extrabold uppercase tracking-[0.18em] text-bg transition hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={16} />
              Back Home
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </PageTransition>
  )
}
