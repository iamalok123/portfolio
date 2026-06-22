import { useSEO } from '../hooks/useSEO'
import { PageTransition } from '../components/layout/PageTransition'
import { Projects as ProjectShowcase } from '../components/sections/Projects'

export function Projects() {
  useSEO({
    title: 'Projects | Alok Hotta — Full-Stack AI Developer',
    description:
      'Explore full-stack web projects by Alok Hotta built with Next.js, React, Node.js, TypeScript, and MongoDB. Scalable, production-ready applications from SIH 2025 winner.',
    canonical: '/projects',
  })

  return (
    <PageTransition>
      <main id="main-content">
        <div className="pt-12">
          <ProjectShowcase showViewAll={false} />
        </div>
      </main>
    </PageTransition>
  )
}
