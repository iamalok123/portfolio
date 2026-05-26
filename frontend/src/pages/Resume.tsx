import { motion } from 'framer-motion'
import { Download, ExternalLink, FileText } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'

const resumeUrl = '/resume.pdf'

export function Resume() {
  return (
    <PageTransition>
      <section className="relative overflow-hidden px-6 pt-32 pb-20 sm:px-8 lg:px-10">
        <div className="absolute inset-x-0 top-20 h-px bg-border" />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
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
                href={resumeUrl}
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
                href={resumeUrl}
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

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 22, delay: 0.08 }}
            className="overflow-hidden rounded-lg border border-border bg-surface"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-2 px-4 py-3 sm:px-5">
              <div className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="size-4 shrink-0" />
                <span className="truncate">Alok Hotta Resume</span>
              </div>
              <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-muted sm:inline">
                PDF Preview
              </span>
            </div>

            <object
              data={`${resumeUrl}#toolbar=1&navpanes=0`}
              type="application/pdf"
              className="h-[78svh] min-h-[34rem] w-full bg-surface-2"
              aria-label="Alok Hotta resume PDF preview"
            >
              <div className="grid min-h-[28rem] place-items-center px-6 py-16 text-center">
                <div>
                  <FileText className="mx-auto text-accent" size={38} />
                  <p className="mt-4 font-display text-2xl font-bold text-foreground">
                    Resume preview is not available in this browser.
                  </p>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="section-cta-link mt-6 inline-flex rounded-full border px-5 py-3 font-display text-xs font-extrabold uppercase tracking-[0.16em] transition"
                  >
                    Open Resume
                  </a>
                </div>
              </div>
            </object>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
