import { Link, useParams } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'

export function BlogPost() {
  const { slug } = useParams()

  return (
    <PageTransition>
      <article className="mx-auto min-h-svh w-full max-w-4xl px-6 pb-20 pt-32 sm:px-8 lg:px-10">
        <Link className="text-sm font-semibold text-accent" to="/blog">
          Back to all posts
        </Link>
        <h1 className="mt-5 font-display text-5xl font-extrabold text-foreground">
          {slug}
        </h1>
      </article>
    </PageTransition>
  )
}
