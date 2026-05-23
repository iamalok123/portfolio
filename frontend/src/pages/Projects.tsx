import { PageTransition } from '../components/layout/PageTransition'
import { Projects as ProjectShowcase } from '../components/sections/Projects'

export function Projects() {
  return (
    <PageTransition>
      <div className="pt-12">
        <ProjectShowcase />
      </div>
    </PageTransition>
  )
}
