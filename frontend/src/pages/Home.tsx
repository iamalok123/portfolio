import { PageTransition } from '../components/layout/PageTransition'
import { About } from '../components/sections/About'
import { Hero } from '../components/sections/Hero'
import { Projects } from '../components/sections/Projects'

export function Home() {
  return (
    <PageTransition>
      <Hero />
      <About />
      <Projects />
    </PageTransition>
  )
}
