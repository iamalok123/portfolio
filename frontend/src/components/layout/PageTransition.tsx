import { motion } from 'framer-motion'
import { useEffect, type PropsWithChildren } from 'react'

export function PageTransition({ children }: PropsWithChildren) {
  useEffect(() => {
    // Ensure we start at the top when the *new* page actually mounts
    window.scrollTo(0, 0)
    
    // Also reset Lenis internal state if available to prevent jump bugs
    const lenis = (window as Window & { lenis?: { scrollTo: (y: number, opts: any) => void } }).lenis
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-svh transform-gpu"
    >
      {children}
    </motion.main>
  )
}
