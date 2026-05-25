import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-9997 h-0.75 w-screen origin-left"
      style={{
        scaleX,
        background:
          'var(--accent)',
      }}
    />
  )
}
