'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  '[role="button"]',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  'label',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
  '[data-cursor="interactive"]',
].join(', ')

function getInteractiveElement(target: EventTarget | null) {
  return target instanceof Element ? target.closest(INTERACTIVE_SELECTOR) : null
}

function getCursorMode(target: EventTarget | null) {
  return getInteractiveElement(target)?.getAttribute('data-cursor')
}

function getTargetAtPoint(e: PointerEvent) {
  return document.elementFromPoint(e.clientX, e.clientY) ?? e.target
}

function shouldHideCursor(target: EventTarget | null) {
  return getCursorMode(target) === 'hidden'
}

function shouldUseTransparentCursor(target: EventTarget | null) {
  return getCursorMode(target) === 'transparent'
}

function shouldExpandCursor(target: EventTarget | null) {
  const interactiveElement = getInteractiveElement(target)
  const cursorMode = interactiveElement?.getAttribute('data-cursor')
  return Boolean(
    interactiveElement &&
      cursorMode !== 'default' &&
      cursorMode !== 'hidden' &&
      cursorMode !== 'transparent',
  )
}

export function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTransparent, setIsTransparent] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring config for smooth lag effect
  const springConfig = { damping: 28, stiffness: 380, mass: 0.4 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    const canUseCustomCursor = () =>
      finePointer.matches && window.innerWidth >= 1024 && navigator.maxTouchPoints === 0

    const syncCursorMode = () => {
      const enabled = canUseCustomCursor()
      setIsEnabled(enabled)

      if (!enabled) {
        setIsVisible(false)
        setIsExpanded(false)
        setIsTransparent(false)
        mouseX.set(-100)
        mouseY.set(-100)
      }
    }

    syncCursorMode()
    window.addEventListener('resize', syncCursorMode)
    finePointer.addEventListener('change', syncCursorMode)

    return () => {
      window.removeEventListener('resize', syncCursorMode)
      finePointer.removeEventListener('change', syncCursorMode)
    }
  }, [mouseX, mouseY])

  useEffect(() => {
    if (!isEnabled) return

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return

      const target = getTargetAtPoint(e)
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      const hideOnTarget = shouldHideCursor(target)
      const transparentOnTarget = shouldUseTransparentCursor(target)
      setIsVisible(!hideOnTarget)
      setIsTransparent(!hideOnTarget && transparentOnTarget)
      setIsExpanded(!hideOnTarget && !transparentOnTarget && shouldExpandCursor(target))
    }

    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return

      const target = getTargetAtPoint(e)
      const hideOnTarget = shouldHideCursor(target)
      const transparentOnTarget = shouldUseTransparentCursor(target)
      setIsVisible(!hideOnTarget)
      setIsTransparent(!hideOnTarget && transparentOnTarget)
      if (getInteractiveElement(target)) {
        setIsExpanded(!hideOnTarget && !transparentOnTarget && shouldExpandCursor(target))
      }
    }

    const handlePointerOut = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return

      const fromInteractive = getInteractiveElement(e.target)
      if (!fromInteractive) return

      const toInteractive = getInteractiveElement(e.relatedTarget)
      if (fromInteractive !== toInteractive) {
        setIsVisible(!shouldHideCursor(e.relatedTarget))
        setIsTransparent(shouldUseTransparentCursor(e.relatedTarget))
        setIsExpanded(false)
      }
    }

    const hideCursor = () => {
      setIsVisible(false)
      setIsExpanded(false)
      setIsTransparent(false)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) hideCursor()
    }

    document.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerover', handlePointerOver, { passive: true })
    document.addEventListener('pointerout', handlePointerOut, { passive: true })
    document.documentElement.addEventListener('mouseleave', hideCursor)
    window.addEventListener('blur', hideCursor)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)
      document.documentElement.removeEventListener('mouseleave', hideCursor)
      window.removeEventListener('blur', hideCursor)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isEnabled, mouseX, mouseY])

  if (!isEnabled) return null

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-9999 hidden rounded-full lg:block"
        style={{
          x: isTransparent ? mouseX : cursorX,
          y: isTransparent ? mouseY : cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isTransparent ? 34 : isExpanded ? 40 : 8,
          height: isTransparent ? 34 : isExpanded ? 40 : 8,
          backgroundColor: isTransparent
            ? 'transparent'
            : isExpanded
              ? 'var(--cursor-expanded)'
              : 'var(--cursor-dot)',
          borderColor: isTransparent ? 'var(--cursor-ring)' : 'transparent',
          borderWidth: isTransparent ? 1 : 0,
          opacity: isVisible ? 1 : 0,
          mixBlendMode: isExpanded && !isTransparent ? 'difference' : 'normal',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.3 }}
      />

      {/* Outer ring — always small, just follows */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-9998 hidden rounded-full border lg:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: 28,
          height: 28,
          borderColor: 'var(--cursor-ring)',
        }}
        animate={{ opacity: isVisible && !isExpanded && !isTransparent ? 0.5 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
