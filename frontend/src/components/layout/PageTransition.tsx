import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

export function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-svh"
    >
      {children}
    </motion.main>
  )
}
