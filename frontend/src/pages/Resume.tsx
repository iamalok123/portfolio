import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, ExternalLink, FileText, Loader2, ZoomIn, ZoomOut } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { PageTransition } from '../components/layout/PageTransition'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const RESUME_URL = '/resume.pdf'

type LenisWindow = Window & { lenis?: { stop: () => void; start: () => void } }

export function Resume() {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [loadError, setLoadError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Pause Lenis on mount so native scroll works inside the PDF viewer ───────
  useEffect(() => {
    const win = window as LenisWindow
    win.lenis?.stop()
    return () => {
      win.lenis?.start()
    }
  }, [])

  const [containerWidth, setContainerWidth] = useState(800)

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        // Subtract a little padding so the canvas never overflows
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
  const zoomIn = () => setScale((s) => Math.min(2.5, +(s + 0.2).toFixed(1)))
  const zoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.2).toFixed(1)))

  return (
    <PageTransition>
      <section className="relative overflow-hidden px-6 pt-32 pb-20 sm:px-8 lg:px-10">
        <div className="absolute inset-x-0 top-20 h-px bg-border" />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">

          {/* ── Header ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 22 }}
            className="flex flex-col justify-between gap-8 border-b border-border pb-10 lg:flex-row lg:items-end"
          >
            <div className="max-w-3xl">
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-accent">
                // resume
              </p>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] text-foreground sm:text-7xl">
                Resume
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                A focused snapshot of my engineering work, projects, and technical experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.a
                href={RESUME_URL}
                download
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-display text-xs font-extrabold uppercase tracking-[0.16em]"
              >
                <Download size={16} />
                Download
              </motion.a>
              <motion.a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="section-cta-link inline-flex items-center gap-2 rounded-full border px-5 py-3 font-display text-xs font-extrabold uppercase tracking-[0.16em] transition"
              >
                Open PDF
                <ExternalLink size={16} />
              </motion.a>
            </div>
          </motion.div>

          {/* ── PDF Viewer Card ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 22, delay: 0.08 }}
            className="overflow-hidden rounded-lg border border-border bg-surface"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2 px-4 py-3 sm:px-5">
              <div className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="size-4 shrink-0" />
                <span className="truncate">Alok Hotta Resume</span>
              </div>

              {/* Controls — only shown once doc is loaded */}
              {!loadError && numPages > 0 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Zoom */}
                  <button
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    title="Zoom out"
                    className="grid size-8 place-items-center rounded-md border border-border text-muted transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="hidden font-mono text-xs text-muted sm:inline w-12 text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={zoomIn}
                    disabled={scale >= 2.5}
                    title="Zoom in"
                    className="grid size-8 place-items-center rounded-md border border-border text-muted transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ZoomIn size={14} />
                  </button>

                  {/* Divider */}
                  <span className="mx-1 h-5 w-px bg-border" />

                  {/* Pagination */}
                  <button
                    onClick={prevPage}
                    disabled={pageNumber <= 1}
                    title="Previous page"
                    className="grid size-8 place-items-center rounded-md border border-border text-muted transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="font-mono text-xs text-muted whitespace-nowrap">
                    {pageNumber} / {numPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={pageNumber >= numPages}
                    title="Next page"
                    className="grid size-8 place-items-center rounded-md border border-border text-muted transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}

              <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-muted sm:inline">
                PDF Preview
              </span>
            </div>

            {/* PDF Canvas area */}
            <div
              ref={containerRef}
              // data-lenis-prevent stops Lenis from stealing scroll inside this container
              data-lenis-prevent
              className="w-full overflow-auto bg-surface-2"
              style={{ maxHeight: '82svh', minHeight: '24rem' }}
            >
              {loadError ? (
                /* ── Fallback when PDF fails to load ──────────────────── */
                <div className="grid min-h-96 place-items-center px-6 py-16 text-center">
                  <div>
                    <FileText className="mx-auto text-accent" size={38} />
                    <p className="mt-4 font-display text-2xl font-bold text-foreground">
                      Preview unavailable in this browser.
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Click below to open or download the PDF directly.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <a
                        href={RESUME_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="section-cta-link inline-flex items-center gap-2 rounded-full border px-5 py-3 font-display text-xs font-extrabold uppercase tracking-[0.16em] transition"
                      >
                        Open Resume <ExternalLink size={14} />
                      </a>
                      <a
                        href={RESUME_URL}
                        download
                        style={{ backgroundColor: 'var(--foreground)', color: 'var(--bg)' }}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-display text-xs font-extrabold uppercase tracking-[0.16em]"
                      >
                        <Download size={14} /> Download
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 gap-4">
                  {isLoading && (
                    <div className="flex flex-col items-center gap-3 py-24">
                      <Loader2 className="animate-spin text-muted" size={32} />
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
                      width={Math.min(containerWidth, 900) * scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="shadow-2xl rounded-sm overflow-hidden"
                    />
                  </Document>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
