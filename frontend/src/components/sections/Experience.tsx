import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { EXPERIENCE_ITEMS, type ExperienceItem } from '../../data/experience'
import { cn } from '../../lib/utils'

type TabType = 'all' | 'work' | 'academic'

interface TabOption {
  id: TabType
  label: string
  count: (items: ExperienceItem[]) => number
}

const TABS: TabOption[] = [
  { id: 'all', label: 'All Milestones', count: (items) => items.length },
  { id: 'work', label: 'Work & Projects', count: (items) => items.filter((i) => i.category === 'work').length },
  { id: 'academic', label: 'Honors & Education', count: (items) => items.filter((i) => i.category === 'honors' || i.category === 'education').length },
]

export function Experience() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const targetRef = useRef<HTMLElement | null>(null)
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.08 })
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 75%', 'end 35%'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  const setRefs = (node: HTMLElement | null) => {
    targetRef.current = node
    inViewRef(node)
  }

  const filteredItems = useMemo(() => {
    return EXPERIENCE_ITEMS.filter((item) => {
      if (activeTab === 'all') return true
      if (activeTab === 'work') return item.category === 'work'
      return item.category === 'honors' || item.category === 'education'
    })
  }, [activeTab])

  return (
    <section id="experience" ref={setRefs} className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 130, damping: 22 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-accent">
            // Journey
          </p>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-foreground sm:text-6xl">
            Experience Timeline
          </h2>
          <p className="mt-4 text-sm text-muted sm:text-base">
            Milestones across engineering projects, hackathons, competitive programming, and academics.
          </p>
        </motion.div>

        {/* Category Switcher Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {TABS.map((tab) => {
            const count = tab.count(EXPERIENCE_ITEMS)
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-5 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] transition-all duration-200',
                  isActive
                    ? 'shadow-md'
                    : 'border border-border bg-surface text-muted hover:border-foreground/40 hover:text-foreground',
                )}
                style={
                  isActive
                    ? { backgroundColor: 'var(--foreground)', color: 'var(--bg)' }
                    : undefined
                }
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-mono font-bold leading-none',
                    isActive ? 'bg-black/20 text-white dark:bg-white/20 dark:text-black' : 'bg-surface-2 text-muted',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative mt-16">
          <div className="absolute left-5 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY }}
            className="absolute left-5 top-0 h-full w-0.5 origin-top bg-accent md:left-1/2 md:-translate-x-1/2"
          />

          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(({ date, title, detail, tags, present, Icon }, index) => {
                const isLeft = index % 2 === 0

                return (
                  <motion.div
                    key={`${date}-${title}`}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                    className={cn(
                      'relative grid gap-5 pl-16 md:grid-cols-2 md:pl-0',
                      isLeft ? 'md:[&>article]:col-start-1' : 'md:[&>article]:col-start-2',
                    )}
                  >
                    <div className="absolute left-2.5 top-7 z-10 grid size-6 place-items-center rounded-full bg-accent text-bg shadow-[0_0_0_8px_var(--bg)] md:left-1/2 md:-translate-x-1/2">
                      <span
                        className={cn(
                          'size-2.5 rounded-full bg-bg transition-colors',
                          present && 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
                        )}
                      />
                    </div>

                    <article
                      className={cn(
                        'rounded-lg border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-accent/45',
                        isLeft ? 'md:mr-10' : 'md:ml-10',
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="rounded-full bg-accent px-3 py-1 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-bg">
                          {date}
                        </span>
                        <span className="grid size-10 place-items-center rounded-md bg-surface-2 text-accent">
                          <Icon size={18} />
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-2xl font-extrabold text-foreground">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
