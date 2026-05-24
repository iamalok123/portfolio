import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'alok_dev_loaded'

export function LoadingScreen() {
  const [show, setShow] = useState(false)
  const [strokeDone, setStrokeDone] = useState(false)

  useEffect(() => {
    // Show loading screen only once per session
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setShow(true)
      sessionStorage.setItem(STORAGE_KEY, '1')

      // Hide after 1.8s
      const timer = setTimeout(() => {
        setShow(false)
      }, 1800)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-99999 flex items-center justify-center bg-bg"
        >
          {/* Noise overlay */}
          <div className="hero-grain pointer-events-none absolute inset-0 opacity-40" />

          {/* Accent glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent)]" />

          <div className="relative flex flex-col items-center gap-6">
            {/* SVG text with stroke animation */}
            <svg
              viewBox="0 0 420 90"
              className="w-64 sm:w-80 md:w-[420px]"
              aria-label="alok.dev"
            >
              <text
                x="50%"
                y="75"
                textAnchor="middle"
                fontFamily="'Syne', system-ui, sans-serif"
                fontSize="80"
                fontWeight="800"
                fill="none"
                stroke="var(--foreground)"
                strokeWidth="1.5"
              >
                alok.dev
              </text>

              {/* Filled version that fades in after stroke */}
              <motion.text
                x="50%"
                y="75"
                textAnchor="middle"
                fontFamily="'Syne', system-ui, sans-serif"
                fontSize="80"
                fontWeight="800"
                fill="var(--foreground)"
                stroke="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: strokeDone ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                alok.dev
              </motion.text>

              {/* Stroke animation overlay */}
              <motion.text
                x="50%"
                y="75"
                textAnchor="middle"
                fontFamily="'Syne', system-ui, sans-serif"
                fontSize="80"
                fontWeight="800"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeDasharray="1"
                initial={{ strokeDashoffset: 1, pathLength: 0 }}
                animate={{ strokeDashoffset: 0, pathLength: 1 }}
                transition={{ duration: 1.0, ease: 'easeInOut' }}
                onAnimationComplete={() => setStrokeDone(true)}
              >
                alok.dev
              </motion.text>
            </svg>

            {/* Loading dots */}
            <motion.div
              className="flex gap-1.5"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
                hidden: {},
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="size-1.5 rounded-full bg-accent"
                  variants={{
                    hidden: { opacity: 0.2, scaleY: 1 },
                    visible: {
                      opacity: [0.2, 1, 0.2],
                      scaleY: [1, 1.8, 1],
                      transition: { duration: 0.7, repeat: Infinity, repeatDelay: 0.1 },
                    },
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
