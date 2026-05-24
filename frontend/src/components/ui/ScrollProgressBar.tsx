import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-9997 h-[3px] w-screen origin-left"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 70%, cyan))',
      }}
    />
  )
}
