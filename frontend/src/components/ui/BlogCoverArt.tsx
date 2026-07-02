import { useState } from 'react'
import { cn } from '../../lib/utils'

interface BlogCoverArtProps {
  title: string
  imageSrc?: string
  compact?: boolean
  className?: string
}

export function BlogCoverArt({ title, imageSrc, compact = false, className }: BlogCoverArtProps) {
  const isAiPost = title.toLowerCase().includes("ai can't save")
  const [failedImageSrc, setFailedImageSrc] = useState('')
  const showImage = Boolean(imageSrc && failedImageSrc !== imageSrc)

  return (
    <div
      className={cn(
        'relative isolate flex overflow-hidden rounded-lg',
        !showImage && 'editorial-cover border border-border text-[#111111]',
        compact && !showImage ? 'aspect-4/3 sm:aspect-video items-center justify-center p-4 sm:p-5' : '',
        compact && showImage ? 'w-full' : '',
        !compact && !showImage ? 'w-full items-center justify-center p-8 sm:p-16 min-h-[280px] sm:min-h-[360px]' : '',
        className,
      )}
    >
      {showImage ? (
          <img
            src={imageSrc}
            alt={title}
            loading="lazy"
            onError={() => setFailedImageSrc(imageSrc ?? '')}
            className={cn(
              'w-full h-auto object-contain',
              !compact && 'max-h-[60vh]'
            )}
          />
      ) : (
        <>
      <div className="pointer-events-none absolute right-[10%] top-[12%] h-[38%] w-[26%] opacity-35">
        <div className="wire-orb absolute left-0 top-4 size-24 rotate-12 rounded-full border border-[#111111]/20 sm:size-36" />
        <div className="wire-orb absolute right-0 top-0 size-16 -rotate-12 rounded-full border border-[#111111]/20 sm:size-24" />
      </div>

      {isAiPost ? (
        <div className="relative max-w-[82%] text-center">
          <p
            className={cn(
              'font-semibold uppercase tracking-[-0.02em]',
              compact ? 'text-[clamp(0.95rem,4vw,1.75rem)] sm:text-[1.75rem]' : 'text-[clamp(1.5rem,7vw,4.2rem)]',
            )}
          >
            AI CAN'T SAVE
          </p>
          <p
            className={cn(
              'mt-1 font-black uppercase tracking-[-0.03em]',
              compact ? 'text-[clamp(1.15rem,5vw,2.1rem)] sm:text-[2rem]' : 'text-[clamp(1.8rem,8vw,4.8rem)]',
            )}
          >
            <span className="underline decoration-[#111111] decoration-4 underline-offset-4">BAD</span>{' '}
            ENGINEERING
          </p>
        </div>
      ) : (
        <div className="relative max-w-[92%] text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#111111]/45">
            alokhotta.site
          </p>
          <p
            className={cn(
              'mt-3 wrap-break-word font-black uppercase leading-[1.02] tracking-[-0.04em]',
              compact ? 'text-[clamp(1.1rem,4vw,1.6rem)] sm:text-[1.45rem] xl:text-[1.55rem]' : 'text-[clamp(1.6rem,6vw,4.6rem)]',
            )}
          >
            {title}
          </p>
        </div>
      )}

      <p className="absolute bottom-5 right-6 text-xs font-semibold text-[#111111]/60">
        @alokhotta.site
      </p>
        </>
      )}
    </div>
  )
}
