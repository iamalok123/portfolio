import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'alokhotta_site_loaded'
const DISPLAY_TIME_MS = 1300

export function PremiumLoader({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={compact ? 'premium-bounce-loader scale-80' : 'premium-bounce-loader'}
      aria-hidden="true"
    >
      <span className="premium-bounce-dot" />
      <span className="premium-bounce-dot" />
      <span className="premium-bounce-dot" />
      <span className="premium-bounce-shadow" />
      <span className="premium-bounce-shadow" />
      <span className="premium-bounce-shadow" />
    </div>
  )
}

export function LoadingScreen() {
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== '1'
    } catch {
      return true
    }
  })
  useEffect(() => {
    if (!show) return

    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Storage can be unavailable in private or locked-down browsing contexts.
    }

    const timer = window.setTimeout(() => {
      setShow(false)
    }, DISPLAY_TIME_MS)

    return () => window.clearTimeout(timer)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-99999 flex items-center justify-center bg-bg px-6"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative flex flex-col items-center gap-9">
            <PremiumLoader />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
