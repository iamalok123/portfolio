import { PageTransition } from '../components/layout/PageTransition'
import { About } from '../components/sections/About'
import { Experience } from '../components/sections/Experience'
import { Hero } from '../components/sections/Hero'
import { Projects } from '../components/sections/Projects'
import { Skills } from '../components/sections/Skills'

export function Home() {
  return (
    <PageTransition>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
    </PageTransition>
  )
}
