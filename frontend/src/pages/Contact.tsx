import { PageTransition } from '../components/layout/PageTransition'
import { Contact as ContactSection } from '../components/sections/Contact'
import { useSEO } from '../hooks/useSEO'

export function Contact() {
  useSEO({
    title: 'Contact | Alok Hotta — Full-Stack AI Developer',
    description:
      'Get in touch with Alok Hotta for full-stack web development, AI integration, freelance projects, internships, or engineering inquiries.',
    canonical: '/contact',
  })

  return (
    <PageTransition>
      <main id="main-content">
        <ContactSection />
      </main>
    </PageTransition>
  )
}
