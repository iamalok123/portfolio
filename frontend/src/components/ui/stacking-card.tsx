import { useTransform, motion, useScroll, type MotionValue } from 'framer-motion'
import { useRef, forwardRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface ProjectData {
  title: string
  description: string
  link?: string
  url?: string
  color?: string
  tags?: string[]
  ctaText?: string
}

export interface CardProps {
  i: number
  title: string
  description: string
  url: string
  color?: string
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
  link?: string
  tags?: string[]
  ctaText?: string
}

export const Card = ({
  i,
  title,
  description,
  url,
  progress,
  range,
  targetScale,
  link = '/contact',
  ctaText = 'Discuss Project',
}: CardProps) => {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.3, 1])
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      ref={container}
      className="sticky top-0 flex h-screen items-center justify-center px-4 sm:px-6"
    >
      <motion.div
        style={{
          scale,
          top: `calc(5vh + ${i * 26}px)`,
        }}
        className={cn(
          'group relative flex w-[min(calc(100vw-2.5rem),56rem)] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border/80 bg-surface/85 p-6 text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-colors origin-top dark:border-white/12 dark:bg-[#0f0f0f]/90 dark:shadow-[0_28px_90px_rgba(0,0,0,0.65)] sm:h-122.5 sm:p-10 lg:h-127.5 lg:p-11',
        )}
      >
        {/* Subtle glass screen grid background effect */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_srgb,var(--foreground)_6%,transparent),transparent_70%)]"
          aria-hidden="true"
        />

        {/* Top header row with macOS traffic light window dots */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3.5 dark:border-white/8">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-muted">
            0{i + 1} // Capability
          </span>
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-xs" />
            <span className="size-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-xs" />
            <span className="size-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-xs" />
          </div>
        </div>

        {/* Card Body with description and display screen */}
        <div className="mt-4 grid flex-1 gap-6 sm:mt-5 sm:grid-cols-[1.15fr_1fr] sm:items-center sm:gap-8">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl lg:text-[2rem]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {description}
              </p>
            </div>

            <div className="pt-5 sm:pt-6">
              <Link
                to={link}
                data-cursor="transparent"
                className="group/btn inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-2/80 px-5 py-2.5 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-foreground backdrop-blur-md transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/10 hover:text-foreground hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:border-white/12 dark:bg-white/5 dark:hover:border-white/35 dark:hover:bg-white/10 dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.08)]"
              >
                <span>{ctaText}</span>
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* High-tech display screen frame */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/80 bg-surface-2 shadow-inner dark:border-white/10 dark:bg-black/60 sm:h-full sm:min-h-60">
            <motion.div className="h-full w-full" style={{ scale: imageScale }}>
              <img
                src={url}
                alt={title}
                loading="lazy"
                className="h-full w-full object-cover object-center grayscale contrast-110 transition duration-700 group-hover:grayscale-0 group-hover:contrast-100"
              />
            </motion.div>
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg/40 via-transparent to-transparent opacity-60"
              aria-hidden="true"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export interface StackingCardsProps {
  projects: ProjectData[]
  title?: string
  subtitle?: string
}

const StackingCards = forwardRef<HTMLElement, StackingCardsProps>(
  ({ projects, title, subtitle }, _ref) => {
    const container = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
      target: container,
      offset: ['start start', 'end end'],
    })

    return (
      <div ref={container} className="relative w-full">
        {title ? (
          <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-28 lg:px-10">
            {subtitle ? (
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-muted">
                {subtitle}
              </p>
            ) : null}
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {title}
            </h2>
          </div>
        ) : null}

        <div className="relative w-full">
          {projects.map((project, i) => {
            const targetScale = 1 - (projects.length - i) * 0.04
            return (
              <Card
                key={`p_${i}`}
                i={i}
                url={project.url || project.link || ''}
                title={project.title}
                color={project.color}
                description={project.description}
                tags={project.tags}
                ctaText={project.ctaText}
                link={project.link || '/contact'}
                progress={scrollYProgress}
                range={[i * (1 / projects.length), 1]}
                targetScale={targetScale}
              />
            )
          })}
        </div>
      </div>
    )
  },
)

StackingCards.displayName = 'StackingCards'

export default StackingCards
