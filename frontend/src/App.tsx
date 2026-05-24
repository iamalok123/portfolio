import Lenis from '@studio-freight/lenis'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { CustomCursor } from './components/ui/CustomCursor'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { ScrollProgressBar } from './components/ui/ScrollProgressBar'

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })))
const Blog = lazy(() => import('./pages/Blog').then((module) => ({ default: module.Blog })))
const BlogPost = lazy(() =>
  import('./pages/BlogPost').then((module) => ({ default: module.BlogPost })),
)
const Projects = lazy(() =>
  import('./pages/Projects').then((module) => ({ default: module.Projects })),
)
const NotFound = lazy(() =>
  import('./pages/NotFound').then((module) => ({ default: module.NotFound })),
)

function RouteFallback() {
  return (
    <div className="grid min-h-svh place-items-center bg-bg px-6">
      <div className="text-center">
        <p className="font-display text-3xl font-extrabold text-foreground">alok.dev</p>
        <div className="mt-4 h-1 w-36 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
        </div>
      </div>
    </div>
  )
}


function App() {
  const location = useLocation()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    // Expose Lenis on window so Navbar's scrollToSection helper can call
    // lenis.scrollTo() directly for the smoothest possible experience
    ;(window as Window & { lenis?: Lenis }).lenis = lenis

    let frame = 0

    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }

    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      ;(window as Window & { lenis?: Lenis }).lenis = undefined
    }
  }, [])

  return (
    <>
      {/* ── Global overlays (above everything) ───────────────────────────────── */}
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgressBar />

      <div className="min-h-svh bg-bg text-foreground">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: 'var(--accent)', secondary: '#0d0d0d' },
            },
          }}
        />
        <Navbar />
        <AnimatePresence mode="wait" initial={false}>
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
        <Footer />
      </div>
    </>
  )
}

export default App
