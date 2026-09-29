import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Layers, Wrench, AlertTriangle, CheckCircle2, X, Sparkles } from 'lucide-react'
import { Github } from 'react-bootstrap-icons'
import type { Project } from '../../types'

interface ProjectHoverCaseStudyProps {
  project: Project | null
  cardRect: DOMRect | null
  onMouseEnterPopup?: () => void
  onMouseLeavePopup?: () => void
  onClose?: () => void
  isTouch?: boolean
}

function calculateCoords(cardRect: DOMRect | null, isTouch: boolean) {
  if (typeof window === 'undefined') {
    return { top: 120, left: 120, width: 660, side: 'right' as const }
  }

  const vw = window.innerWidth
  const vh = window.innerHeight

  // On touch screens or screens smaller than lg (1024px), center the pop-up in the viewport
  if (!cardRect || vw < 1024 || isTouch) {
    const width = Math.min(640, vw - 28)
    const height = 430
    return {
      top: Math.max(16, (vh - height) / 2),
      left: Math.max(14, (vw - width) / 2),
      width,
      side: 'center' as const,
    }
  }

  const cardCenterX = cardRect.left + cardRect.width / 2
  const screenCenterX = vw / 2
  const cardCenterY = cardRect.top + cardRect.height / 2
  const popupHeight = 420

  // Vertically align with card center, clamped to prevent top/bottom viewport clipping
  const top = Math.max(20, Math.min(cardCenterY - popupHeight / 2, vh - popupHeight - 20))

  // Detect if this is specifically a middle column card in a 3-column desktop layout
  const isMiddleCard = Math.abs(cardCenterX - screenCenterX) < cardRect.width * 0.45

  if (isMiddleCard) {
    const spaceRight = vw - cardRect.right - 24
    const spaceLeft = cardRect.left - 24

    // Prefer whichever side has more available room, sizing width to NEVER overlap the middle card
    if (spaceRight >= spaceLeft) {
      const midPopupWidth = Math.min(540, Math.max(420, spaceRight - 12))
      return {
        top,
        left: cardRect.right + 14,
        width: midPopupWidth,
        side: 'right' as const,
      }
    } else {
      const midPopupWidth = Math.min(540, Math.max(420, spaceLeft - 12))
      return {
        top,
        left: cardRect.left - midPopupWidth - 14,
        width: midPopupWidth,
        side: 'left' as const,
      }
    }
  }

  // Standard Left or Right column cards:
  const popupWidth = Math.min(660, vw - 40)
  let left: number
  let side: 'left' | 'right' | 'center' = 'right'

  if (cardCenterX < screenCenterX) {
    // Card is on the left half of the screen -> Place pop-up to the right
    side = 'right'
    left = cardRect.right + 16
  } else {
    // Card is on the right half of the screen -> Place pop-up to the left
    side = 'left'
    left = cardRect.left - popupWidth - 16
  }

  // Clamp within viewport margins
  left = Math.max(16, Math.min(left, vw - popupWidth - 16))

  return {
    top,
    left,
    width: popupWidth,
    side,
  }
}

export function ProjectHoverCaseStudy({
  project,
  cardRect,
  onMouseEnterPopup,
  onMouseLeavePopup,
  onClose,
  isTouch = false,
}: ProjectHoverCaseStudyProps) {
  // Recalculate coordinates on scroll or resize so pop-up tracks smoothly
  const [, setTick] = useState(0)

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1)
    window.addEventListener('resize', handleUpdate)
    window.addEventListener('scroll', handleUpdate, { passive: true })
    return () => {
      window.removeEventListener('resize', handleUpdate)
      window.removeEventListener('scroll', handleUpdate)
    }
  }, [])

  const coords = calculateCoords(cardRect, isTouch)
  const caseStudy = project?.caseStudy

  if (typeof document === 'undefined') return null

  return (
    <>
      {/* ── Background Blur Backdrop (Rendered in section context so hovered card stays in front) ── */}
      <AnimatePresence>
        {project && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              WebkitBackdropFilter: 'blur(12px)',
              backdropFilter: 'blur(12px)',
            }}
            className={`fixed inset-0 z-40 bg-black/60 dark:bg-black/75 transition-all ${
              isTouch ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
            }`}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Designed Non-Scrollable Case Study Pop-Up (Portal to document.body for true viewport positioning) ── */}
      {createPortal(
        <AnimatePresence>
          {project && (
            <motion.aside
              key={`popup-${project._id}`}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              onMouseEnter={onMouseEnterPopup}
              onMouseLeave={onMouseLeavePopup}
              style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                zIndex: 99999,
              }}
              className={`overflow-hidden rounded-2xl border border-accent/50 bg-[#0e0e11]/98 text-foreground shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-2xl pointer-events-auto flex flex-col ${
                coords.side === 'right'
                  ? "before:absolute before:-left-5 before:top-0 before:bottom-0 before:w-5 before:content-['']"
                  : coords.side === 'left'
                    ? "after:absolute after:-right-5 after:top-0 after:bottom-0 after:w-5 after:content-['']"
                    : ''
              }`}
              role="dialog"
              aria-label={`${project.title} Case Study`}
            >
              {/* Glowing accent border line */}
              <div className="h-1 w-full bg-linear-to-r from-transparent via-accent to-transparent opacity-90 shrink-0" />

              <div className="p-4.5 sm:p-5 flex flex-col flex-1">
                {/* Header Row: Category Badge | Title | Action Buttons */}
                <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-3.5 shrink-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                        // {caseStudy ? 'Architectural Case Study' : 'Project Architecture'}
                      </span>
                      <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-bold font-mono text-muted">
                        #{project.order}
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-xl font-extrabold sm:text-2xl text-foreground truncate">
                      {project.title}
                    </h3>
                    {caseStudy?.tagline ? (
                      <p className="mt-0.5 text-xs font-medium text-muted line-clamp-1">
                        {caseStudy.tagline}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs font-medium text-muted line-clamp-1">
                        {project.desc}
                      </p>
                    )}
                  </div>

                  {/* Quick Action Links & Close */}
                  <div className="flex items-center gap-2 shrink-0">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} GitHub Source Code`}
                        className="grid size-8 place-items-center rounded-full border border-border bg-surface-2 text-foreground transition hover:border-accent hover:text-accent"
                      >
                        <Github size={14} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider transition hover:scale-105"
                      >
                        <span>Live</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {onClose && (
                      <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close Pop-up"
                        className="grid size-8 place-items-center rounded-full border border-border bg-surface-2 text-muted transition hover:border-accent hover:text-foreground cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Content Grid: 100% Non-Scrollable Layout ────────────────────── */}
                {caseStudy ? (
                  <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Left Column: Problem & Tech Stack */}
                    <div className="flex flex-col gap-3">
                      {/* Problem & Motivation */}
                      {caseStudy.problem && (
                        <div className="rounded-xl border border-border/70 bg-surface-2/50 p-3">
                          <h4 className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                            <Sparkles size={11} />
                            Problem & Motivation
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-4">
                            {caseStudy.problem}
                          </p>
                        </div>
                      )}

                      {/* Production Tech Stack */}
                      <div className="rounded-xl border border-border/70 bg-surface-2/30 p-3">
                        <h4 className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                          <Layers size={11} className="text-accent" />
                          Stack Components
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-border/80 bg-surface px-2 py-0.5 font-mono text-[10px] font-medium text-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Architecture & Outcomes */}
                    <div className="flex flex-col gap-3">
                      {/* System Architecture Decisions */}
                      {caseStudy.architecture && caseStudy.architecture.length > 0 && (
                        <div className="rounded-xl border border-border/70 bg-surface-2/40 p-3">
                          <h4 className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
                            <Wrench size={11} className="text-accent" />
                            Key Architecture Decisions
                          </h4>
                          <ul className="mt-2 space-y-1.5">
                            {caseStudy.architecture.slice(0, 3).map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs leading-snug text-muted"
                              >
                                <span className="grid size-4 shrink-0 place-items-center rounded-full bg-accent/15 font-mono text-[9px] font-bold text-accent mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="line-clamp-2">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Challenges & Measurable Outcomes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {caseStudy.challenges?.[0] && (
                          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-2.5">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-500">
                              <AlertTriangle size={11} />
                              Challenge Solved
                            </div>
                            <p className="mt-1 text-[11px] leading-snug text-muted line-clamp-2">
                              {caseStudy.challenges[0]}
                            </p>
                          </div>
                        )}

                        {caseStudy.outcomes?.[0] && (
                          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-2.5">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-500">
                              <CheckCircle2 size={11} />
                              Measurable Impact
                            </div>
                            <p className="mt-1 text-[11px] leading-snug text-foreground font-medium line-clamp-2">
                              {caseStudy.outcomes[0]}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Fallback for projects without detailed case study */
                  <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="rounded-xl border border-border/70 bg-surface-2/50 p-3.5">
                      <h4 className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                        <Sparkles size={11} />
                        Project Overview
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-4">
                        {project.desc}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-medium text-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-surface-2/40 p-3.5 flex flex-col justify-between">
                      <div>
                        <h4 className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
                          <CheckCircle2 size={11} className="text-emerald-500" />
                          Engineering Highlights
                        </h4>
                        <ul className="mt-2.5 space-y-2 text-xs text-muted">
                          <li className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-accent" />
                            Production-tested web application
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-accent" />
                            Responsive cross-device design system
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-accent" />
                            Optimized for performance and accessibility
                          </li>
                        </ul>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted font-mono">
                        <span>Status: Deployed</span>
                        {project.liveUrl && <span className="text-accent">Live online</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
