import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Layers, Wrench, AlertTriangle, CheckCircle2, X } from 'lucide-react'
import { Github } from 'react-bootstrap-icons'
import { useEffect, useRef } from 'react'
import { useModalScrollLock } from '../../hooks/useModalScrollLock'
import type { Project } from '../../types'

interface ProjectCaseStudyModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectCaseStudyModal({ project, isOpen, onClose }: ProjectCaseStudyModalProps) {
  useModalScrollLock(isOpen)
  const bodyRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Preserve the last selected project during AnimatePresence exit animations
  const lastProjectRef = useRef<Project | null>(project)
  if (project) {
    lastProjectRef.current = project
  }
  const activeProject = project || lastProjectRef.current

  // Native non-passive wheel handling to guarantee background page never scrolls
  // and rolling wheel anywhere over the dialog card scrolls the case study body
  useEffect(() => {
    if (!isOpen) return

    const cardEl = cardRef.current
    const bodyEl = bodyRef.current
    const backdropEl = backdropRef.current
    const wrapperEl = wrapperRef.current

    const handleCardWheel = (e: WheelEvent) => {
      e.stopPropagation()

      if (!bodyEl) {
        e.preventDefault()
        return
      }

      // If wheel event originates from inside the scrollable body
      if (bodyEl.contains(e.target as Node)) {
        const { scrollTop, scrollHeight, clientHeight } = bodyEl
        const delta = e.deltaY

        const isScrollingDown = delta > 0
        const isScrollingUp = delta < 0

        const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight
        const isAtTop = scrollTop <= 0

        // If at boundaries and trying to scroll past, prevent event from leaking to background
        if ((isScrollingDown && isAtBottom) || (isScrollingUp && isAtTop)) {
          e.preventDefault()
        }
        return
      }

      // If wheel event is on header, footer, or borders outside body:
      // Forward scroll directly to the body and prevent background scroll!
      e.preventDefault()
      bodyEl.scrollTop += e.deltaY
    }

    const blockEvent = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }

    if (cardEl) {
      cardEl.addEventListener('wheel', handleCardWheel, { passive: false })
    }
    if (backdropEl) {
      backdropEl.addEventListener('wheel', blockEvent, { passive: false })
      backdropEl.addEventListener('touchmove', blockEvent, { passive: false })
    }
    if (wrapperEl) {
      const handleWrapperWheel = (e: WheelEvent) => {
        if (e.target === wrapperEl) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      wrapperEl.addEventListener('wheel', handleWrapperWheel, { passive: false })
      wrapperEl.addEventListener('touchmove', blockEvent, { passive: false })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      if (cardEl) {
        cardEl.removeEventListener('wheel', handleCardWheel)
      }
      if (backdropEl) {
        backdropEl.removeEventListener('wheel', blockEvent)
        backdropEl.removeEventListener('touchmove', blockEvent)
      }
      if (wrapperEl) {
        wrapperEl.removeEventListener('wheel', blockEvent)
        wrapperEl.removeEventListener('touchmove', blockEvent)
      }
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!activeProject) return null

  const caseStudy = activeProject.caseStudy

  return (
    <Dialog.Root modal={false} open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <motion.div
              ref={backdropRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              style={{
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
              className="fixed inset-0 z-100 bg-black/60 dark:bg-black/75 cursor-pointer"
            />

            <div
              ref={wrapperRef}
              data-lenis-prevent
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  onClose()
                }
              }}
              className="fixed inset-0 z-101 flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto"
            >
              <Dialog.Content asChild>
                <motion.div
                  ref={cardRef}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  data-lenis-prevent
                  className="relative flex max-h-[88vh] min-h-0 w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border/90 bg-surface text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.6)] dark:border-white/12 dark:bg-[#111111]"
                >
                  {/* Modal Header */}
                  <div className="flex items-start justify-between border-b border-border p-6 sm:p-7 shrink-0">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
                          // Architectural Case Study
                        </span>
                        <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-muted">
                          Rank #{activeProject.order}
                        </span>
                      </div>
                      <Dialog.Title className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
                        {activeProject.title}
                      </Dialog.Title>
                      {caseStudy?.tagline && (
                        <p className="mt-1 text-sm font-medium text-muted sm:text-base">
                          {caseStudy.tagline}
                        </p>
                      )}
                    </div>

                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close dialog"
                        className="grid size-9 place-items-center rounded-full border border-border bg-surface-2 text-muted transition hover:border-accent hover:text-foreground cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Scrollable Modal Body */}
                  <div
                    ref={bodyRef}
                    data-lenis-prevent
                    tabIndex={0}
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 space-y-6 sm:p-7 custom-scrollbar focus:outline-none"
                  >
                    {/* Tech stack badge list */}
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                        <Layers size={14} className="text-accent" />
                        Production Tech Stack
                      </h4>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {activeProject.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold text-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Problem Statement */}
                    {caseStudy?.problem && (
                      <div className="rounded-xl border border-border/80 bg-surface-2/60 p-5">
                        <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                          Problem & Motivation
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                          {caseStudy.problem}
                        </p>
                      </div>
                    )}

                    {/* Architecture Decisions */}
                    {caseStudy?.architecture && caseStudy.architecture.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                          <Wrench size={14} className="text-accent" />
                          System Architecture & Key Decisions
                        </h4>
                        <ul className="mt-3 space-y-2.5">
                          {caseStudy.architecture.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 rounded-lg border border-border/60 bg-surface-2/40 p-3.5 text-sm leading-relaxed text-muted"
                            >
                              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 font-mono text-[11px] font-bold text-accent">
                                {idx + 1}
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technical Challenges */}
                    {caseStudy?.challenges && caseStudy.challenges.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                          <AlertTriangle size={14} className="text-amber-500" />
                          Engineering Challenges Solved
                        </h4>
                        <ul className="mt-3 space-y-2.5">
                          {caseStudy.challenges.map((challenge, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 rounded-lg border border-border/60 bg-surface-2/40 p-3.5 text-sm leading-relaxed text-muted"
                            >
                              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-amber-500" />
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Measurable Outcomes */}
                    {caseStudy?.outcomes && caseStudy.outcomes.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          Measurable Outcomes & Impact
                        </h4>
                        <ul className="mt-3 space-y-2.5">
                          {caseStudy.outcomes.map((outcome, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-sm leading-relaxed text-foreground"
                            >
                              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-2/50 px-6 py-4 sm:px-7 shrink-0">
                    <span className="text-xs text-muted">
                      Full-Stack AI Project Showcase
                    </span>

                    <div className="flex items-center gap-3">
                      {activeProject.githubUrl && (
                        <a
                          href={activeProject.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:border-accent hover:bg-surface-2"
                        >
                          <Github size={15} />
                          Source Code
                        </a>
                      )}
                      {activeProject.liveUrl && (
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] transition hover:scale-105"
                        >
                          Live Site
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
