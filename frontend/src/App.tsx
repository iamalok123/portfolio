import Lenis from '@studio-freight/lenis'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'

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

    let frame = 0

    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }

    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="min-h-svh bg-bg text-foreground">
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Suspense key={location.pathname} fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  )
}

export default App
