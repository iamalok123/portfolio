import Lenis from '@studio-freight/lenis'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Projects } from './pages/Projects'

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
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
