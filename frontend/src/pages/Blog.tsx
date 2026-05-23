import { PageTransition } from '../components/layout/PageTransition'

export function Blog() {
  return (
    <PageTransition>
      <section className="mx-auto min-h-svh w-full max-w-7xl px-6 pb-20 pt-32 sm:px-8 lg:px-10">
        <p className="font-mono text-sm uppercase tracking-[0.28em] text-accent">
          /blog
        </p>
        <h1 className="mt-5 font-display text-5xl font-extrabold text-foreground">
          Blog foundation
        </h1>
      </section>
    </PageTransition>
  )
}
