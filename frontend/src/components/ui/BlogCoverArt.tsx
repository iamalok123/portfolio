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
        'editorial-cover relative isolate flex aspect-video overflow-hidden rounded-lg border border-border text-[#111111]',
        compact ? 'items-center justify-center p-5' : 'items-center justify-center p-8 sm:p-12',
        className,
      )}
    >
      {showImage ? (
        <>
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            onError={() => setFailedImageSrc(imageSrc ?? '')}
            className="absolute inset-0 size-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 via-[#111111]/10 to-transparent" />
          <p className="relative mt-auto max-w-[88%] text-center text-[clamp(1.2rem,5vw,3.6rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white">
            {title}
          </p>
        </>
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
              compact ? 'text-[clamp(1.05rem,6vw,2.2rem)]' : 'text-[clamp(1.8rem,7vw,4.2rem)]',
            )}
          >
            AI CAN'T SAVE
          </p>
          <p
            className={cn(
              'mt-1 font-black uppercase tracking-[-0.03em]',
              compact ? 'text-[clamp(1.25rem,7vw,2.8rem)]' : 'text-[clamp(2rem,8vw,4.8rem)]',
            )}
          >
            <span className="underline decoration-[#111111] decoration-4 underline-offset-4">BAD</span>{' '}
            ENGINEERING
          </p>
        </div>
      ) : (
        <div className="relative max-w-[86%] text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#111111]/45">
            alokhotta.site
          </p>
          <p
            className={cn(
              'mt-3 font-black uppercase leading-[0.92] tracking-[-0.04em]',
              compact ? 'text-[clamp(1.3rem,7vw,2.8rem)]' : 'text-[clamp(2rem,8vw,4.6rem)]',
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
