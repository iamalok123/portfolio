import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { PageTransition } from '../components/layout/PageTransition'
import { useSEO } from '../hooks/useSEO'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const RESUME_URL = '/resume.pdf'

export function Resume() {
  useSEO({
    title: 'Resume | Alok Hotta — Full-Stack AI Developer',
    description:
      "View and download Alok Hotta's resume. Full-Stack AI Developer skilled in Next.js, React, Node.js, TypeScript, MongoDB. LeetCode Knight (1900+). SIH 2025 College Winner. Open to internships & freelance roles.",
    canonical: '/resume',
  })

  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [loadError, setLoadError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(800)

  // Measure container width for responsive PDF rendering
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 2)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setLoadError(false)
  }, [])

  const onDocumentLoadError = useCallback(() => {
    setIsLoading(false)
    setLoadError(true)
  }, [])

  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1))
  const nextPage = () => setPageNumber((p) => Math.min(numPages, p + 1))
  const zoomIn  = () => setScale((s) => Math.min(2.5, +(s + 0.2).toFixed(1)))
  const zoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.2).toFixed(1)))

  return (
    <PageTransition>
      {/* ── Page wrapper: full height, flex column so PDF viewer fills remaining space */}
      <main id="main-content">
      <section className="flex flex-col px-4 pt-24 pb-4 sm:px-6 lg:px-8" style={{ minHeight: '100svh' }} aria-label="Alok Hotta Resume">

        {/* ── Compact Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 24 }}
          className="mx-auto w-full max-w-6xl"
        >
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: title */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">// resume</span>
              <span className="h-4 w-px bg-border" />
              <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
                Alok Hotta
              </h1>
              <span className="hidden text-sm text-muted sm:inline">— Full-Stack AI Developer</span>
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-2">
              <motion.a
                href={RESUME_URL}
                download
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-xs font-extrabold uppercase tracking-[0.14em]"
              >
                <Download size={13} />
                Download
              </motion.a>
              <motion.a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="section-cta-link inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-display text-xs font-extrabold uppercase tracking-[0.14em] transition"
              >
                Open PDF
                <ExternalLink size={13} />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* ── PDF Viewer Card — grows to fill remaining viewport height ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 24, delay: 0.06 }}
          className="mx-auto mt-4 flex w-full max-w-6xl flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface"
          style={{ minHeight: 0 }}
        >
          {/* Toolbar */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-surface-2 px-3 py-2 sm:px-4">
            <div className="inline-flex min-w-0 items-center gap-2 text-xs font-semibold text-foreground">
              <FileText className="size-3.5 shrink-0" />
              <span className="truncate">Alok Hotta — Resume.pdf</span>
            </div>

            {/* Controls */}
            {!loadError && numPages > 0 && (
              <div className="flex items-center gap-1">
                {/* Zoom */}
                <button
                  onClick={zoomOut}
                  disabled={scale <= 0.5}
                  title="Zoom out"
                  className="grid size-7 place-items-center rounded border border-border text-muted transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ZoomOut size={12} />
                </button>
                <span className="w-10 text-center font-mono text-xs text-muted">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={scale >= 2.5}
                  title="Zoom in"
                  className="grid size-7 place-items-center rounded border border-border text-muted transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ZoomIn size={12} />
                </button>

                <span className="mx-1.5 h-4 w-px bg-border" />

                {/* Pagination */}
                <button
                  onClick={prevPage}
                  disabled={pageNumber <= 1}
                  title="Previous page"
                  className="grid size-7 place-items-center rounded border border-border text-muted transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={12} />
                </button>
                <span className="whitespace-nowrap font-mono text-xs text-muted">
                  {pageNumber} / {numPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={pageNumber >= numPages}
                  title="Next page"
                  className="grid size-7 place-items-center rounded border border-border text-muted transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            )}

            <span className="hidden font-mono text-xs uppercase tracking-[0.16em] text-muted sm:inline">
              PDF Preview
            </span>
          </div>

          {/* PDF Canvas — scrollable inner area, lenis prevented here only */}
          <div
            ref={containerRef}
            data-lenis-prevent
            className="flex-1 overflow-auto bg-surface-2"
            style={{ minHeight: 0 }}
          >
            {loadError ? (
              /* Fallback */
              <div className="grid h-full min-h-64 place-items-center px-6 py-12 text-center">
                <div>
                  <FileText className="mx-auto text-accent" size={32} />
                  <p className="mt-3 font-display text-xl font-bold text-foreground">
                    Preview unavailable in this browser.
                  </p>
                  <p className="mt-1.5 text-sm text-muted">
                    Click below to open or download the PDF directly.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <a
                      href={RESUME_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="section-cta-link inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-display text-xs font-extrabold uppercase tracking-[0.14em] transition"
                    >
                      Open Resume <ExternalLink size={13} />
                    </a>
                    <a
                      href={RESUME_URL}
                      download
                      style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs font-extrabold uppercase tracking-[0.14em]"
                    >
                      <Download size={13} /> Download
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4 gap-3">
                {isLoading && (
                  <div className="flex flex-col items-center gap-2 py-20">
                    <Loader2 className="animate-spin text-muted" size={28} />
                    <p className="font-mono text-xs uppercase tracking-widest text-muted">
                      Loading PDF…
                    </p>
                  </div>
                )}
                <Document
                  file={RESUME_URL}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={null}
                  error={null}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(containerWidth, 860) * scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-xl rounded overflow-hidden"
                  />
                </Document>
              </div>
            )}
          </div>
        </motion.div>
      </section>
      </main>
    </PageTransition>
  )
}
