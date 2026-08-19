import StackingCards, { type ProjectData } from '../ui/stacking-card'

const SERVICES: ProjectData[] = [
  {
    title: 'Full-Stack Web Engineering',
    description:
      'Architecting and shipping end-to-end production web applications with Next.js, React, Node.js, and TypeScript. Designed for high throughput, type safety, and clean scalable codebases.',
    link: `/contact?subject=${encodeURIComponent('Full-Stack Web Application Inquiry')}&message=${encodeURIComponent("Hi Alok, I am interested in building a full-stack web application with you. Let's connect to discuss our project goals, tech stack, and timeline.")}`,
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Build Your App',
  },
  {
    title: 'AI & Intelligent Systems',
    description:
      'Integrating advanced AI capabilities into modern applications. Designing RAG knowledge bases, autonomous agents, vector embeddings, and LLM-powered business automation workflows.',
    link: `/contact?subject=${encodeURIComponent('AI & Agentic Systems Integration')}&message=${encodeURIComponent("Hi Alok, I'd like to integrate AI capabilities (LLMs, RAG, or autonomous agents) into our product. Let's connect to explore how we can collaborate.")}`,
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Integrate AI',
  },
  {
    title: 'High-Performance UI/UX & Motion',
    description:
      'Crafting fluid, visually captivating digital experiences with micro-interactions, Lenis physics smooth-scrolling, Framer Motion, and design systems built for accessibility and responsiveness.',
    link: `/contact?subject=${encodeURIComponent('UI/UX Design & Frontend Motion Inquiry')}&message=${encodeURIComponent("Hi Alok, we want to elevate our product's frontend experience with high-performance animations, fluid interactions, and modern design systems.")}`,
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Elevate Interface',
  },
  {
    title: 'Cloud Architecture & Scalability',
    description:
      'Engineering robust distributed systems with MongoDB, PostgreSQL, Redis caching, Docker containerization, and automated CI/CD pipelines deployed to high-availability edge networks.',
    link: `/contact?subject=${encodeURIComponent('Cloud Architecture & Infrastructure Consultation')}&message=${encodeURIComponent("Hi Alok, I would like to consult with you on scaling our backend architecture, optimizing databases, and deploying reliable cloud infrastructure.")}`,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Scale Infrastructure',
  },
]

export function ServicesStack() {
  return (
    <section id="services" className="relative w-full py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-muted">
              // Capabilities
            </p>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.06] text-foreground sm:text-6xl">
              What I Can Do For You.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted sm:text-base">
            From technical architecture to pixel-perfect delivery — scalable solutions tailored to turn ambitious ideas into reality.
          </p>
        </div>
      </div>

      <div className="mt-16 sm:mt-20">
        <StackingCards projects={SERVICES} />
      </div>
    </section>
  )
}
