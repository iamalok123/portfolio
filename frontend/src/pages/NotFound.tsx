import { Link } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'

export function NotFound() {
  return (
    <PageTransition>
      <section className="grid min-h-svh place-items-center px-6 text-center">
        <div>
          <p className="font-display text-8xl font-extrabold text-accent">404</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-foreground">
            Page not found
          </h1>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:scale-105"
          >
            Back home
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
