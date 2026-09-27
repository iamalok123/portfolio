import { useEffect } from 'react'

let lockCount = 0
let savedScrollY = 0
let previousBodyStyles = {
  position: '',
  top: '',
  left: '',
  right: '',
  width: '',
  overflow: '',
  paddingRight: '',
}
let previousHtmlOverflow = ''

export function lockScroll() {
  if (typeof window === 'undefined') return

  lockCount++
  if (lockCount === 1) {
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0

    // Measure scrollbar width to prevent layout shift when scrollbar vanishes
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    const lenis = (window as Window & { lenis?: { stop: () => void } }).lenis
    lenis?.stop?.()

    previousBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    }
    previousHtmlOverflow = document.documentElement.style.overflow

    // Freeze body position at the exact current scroll position
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    document.documentElement.style.overflow = 'hidden'
    document.body.setAttribute('data-modal-locked', 'true')
  }
}

export function unlockScroll() {
  if (typeof window === 'undefined') return

  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.position = previousBodyStyles.position
    document.body.style.top = previousBodyStyles.top
    document.body.style.left = previousBodyStyles.left
    document.body.style.right = previousBodyStyles.right
    document.body.style.width = previousBodyStyles.width
    document.body.style.overflow = previousBodyStyles.overflow
    document.body.style.paddingRight = previousBodyStyles.paddingRight
    document.documentElement.style.overflow = previousHtmlOverflow
    document.body.removeAttribute('data-modal-locked')

    // Restore exact scroll position
    window.scrollTo(0, savedScrollY)

    const lenis = (window as Window & {
      lenis?: {
        start: () => void
        scrollTo: (target: number, opts?: { immediate?: boolean }) => void
      }
    }).lenis

    lenis?.scrollTo?.(savedScrollY, { immediate: true })
    lenis?.start?.()
  }
}

/**
 * Custom React hook to prevent background scrolling when a modal or dialog is open.
 * Freezes body position with position: fixed and coordinates with Lenis smooth scrolling.
 */
export function useModalScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return

    lockScroll()

    return () => {
      unlockScroll()
    }
  }, [isOpen])
}

