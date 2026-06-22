import { useSEO } from '../hooks/useSEO'
import { PageTransition } from '../components/layout/PageTransition'
import { About } from '../components/sections/About'
import { BlogPreview } from '../components/sections/BlogPreview'
import { Contact } from '../components/sections/Contact'
import { Experience } from '../components/sections/Experience'
import { Hero } from '../components/sections/Hero'
import { Projects } from '../components/sections/Projects'
import { Skills } from '../components/sections/Skills'

export function Home() {
  useSEO({
    title: 'Alok Hotta | Full-Stack AI Developer & SIH 2025 Winner',
    description:
      'Alok Hotta — Full-Stack AI Developer from Bhubaneswar building scalable web products. Expert in Next.js, React, Node.js, TypeScript & MongoDB. LeetCode Knight (1900+). SIH 2025 College Winner. Open to freelance & internships.',
    canonical: '/',
  })

  return (
    <PageTransition>
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <BlogPreview />
        <Contact />
      </main>
    </PageTransition>
  )
}
