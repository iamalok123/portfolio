'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring config for smooth lag effect
  const springConfig = { damping: 28, stiffness: 380, mass: 0.4 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Completely disable on mobile/tablet devices (either by touch detection or screen width)
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouch || window.innerWidth < 1024 || navigator.maxTouchPoints > 0) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnterInteractive = () => setIsExpanded(true)
    const handleMouseLeaveInteractive = () => setIsExpanded(false)

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)

    // Track interactive elements
    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label'

    const attachListeners = () => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive)
        el.addEventListener('mouseleave', handleMouseLeaveInteractive)
      })
    }

    attachListeners()

    // Re-attach on DOM changes
    const observer = new MutationObserver(attachListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter)
      observer.disconnect()
    }
  }, [mouseX, mouseY, isVisible])

  // Don't render component at all if we know it's a touch device
  if (typeof window !== 'undefined' && navigator.maxTouchPoints > 0) return null

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-9999 hidden rounded-full lg:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isExpanded ? 40 : 8,
          height: isExpanded ? 40 : 8,
          backgroundColor: isExpanded ? 'var(--accent)' : 'var(--accent)',
          opacity: isVisible ? 1 : 0,
          mixBlendMode: isExpanded ? 'difference' : 'normal',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.3 }}
      />

      {/* Outer ring — always small, just follows */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-9998 hidden rounded-full border border-accent/40 lg:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: 28,
          height: 28,
        }}
        animate={{ opacity: isVisible && !isExpanded ? 0.5 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
