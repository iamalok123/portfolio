import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import type { PropsWithChildren } from 'react'

interface RevealSectionProps extends PropsWithChildren {
  delay?: number
  className?: string
  as?: 'section' | 'div' | 'article' | 'main'
}

export function RevealSection({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: RevealSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  })

  const MotionTag = motion[Tag] as typeof motion.div

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
