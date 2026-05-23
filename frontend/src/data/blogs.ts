import type { Blog } from '../types'

export const BLOGS_MOCK: Blog[] = [
  {
    _id: 'blog-zephyr',
    title: 'Building Zephyr: Lessons From an AI Website Builder',
    slug: 'building-zephyr-ai-website-builder',
    category: 'Projects',
    tags: ['AI', 'React', 'LangChain', 'Product'],
    readTime: 7,
    publishedAt: '2026-05-10',
    coverImage: '',
    featured: true,
    content: `# Building Zephyr: Lessons From an AI Website Builder

Zephyr started as a simple question: what would it feel like if a website builder understood product intent before it touched layout?

Instead of generating a static page and stopping there, I wanted a workflow where the system could reason about structure, components, copy, and implementation constraints.

## The Product Shape

The first version focuses on three loops: prompt, generate, refine.

- The prompt captures the target user, business type, and must-have sections.
- The generator creates a structured page model instead of one large blob of UI.
- The refinement pass checks spacing, hierarchy, and responsive behavior.

That last step matters because AI output can look impressive while still being hard to use.

## Architecture Notes

The frontend is React and Tailwind. The backend handles generation orchestration, provider calls, persistence, and project history.

\`\`\`ts
type PageBlock = {
  id: string
  kind: 'hero' | 'features' | 'pricing' | 'faq'
  intent: string
  content: Record<string, string>
}
\`\`\`

Keeping page blocks structured makes it easier to regenerate one section without destroying the whole page.

## What I Learned

The biggest lesson is that AI product quality depends on constraints. Strong constraints do not make the output less creative. They make it editable, predictable, and shippable.

> A good AI feature should feel like leverage, not a slot machine.

## Next Steps

I am improving component selection, version history, and export quality. The long-term goal is a builder that helps developers move faster without hiding the code from them.`,
  },
  {
    _id: 'blog-leetcode',
    title: 'How I Approach LeetCode Without Burning Out',
    slug: 'leetcode-without-burning-out',
    category: 'Career',
    tags: ['DSA', 'C++', 'LeetCode', 'Habits'],
    readTime: 5,
    publishedAt: '2026-04-18',
    coverImage: '',
    featured: true,
    content: `# How I Approach LeetCode Without Burning Out

Competitive programming rewards consistency more than intensity. The difficult part is building a rhythm that survives exams, projects, and real life.

## My Weekly System

I keep the system lightweight:

1. Practice patterns, not random problem counts.
2. Review failed problems after a short delay.
3. Keep notes for recurring mistakes.
4. Re-solve important problems without looking at the old code.

## Pattern First

When I study a topic, I group problems by the idea behind them: sliding window, binary search on answer, graph traversal, dynamic programming, or greedy exchange arguments.

\`\`\`cpp
int best = 0;
for (int right = 0; right < n; right++) {
  while (!valid()) {
    left++;
  }
  best = max(best, right - left + 1);
}
\`\`\`

This makes the next similar problem less mysterious.

## Burnout Control

Some days are for hard problems. Some days are for review. Both count.

The point is not to grind forever. The point is to become reliable under pressure.`,
  },
  {
    _id: 'blog-mern',
    title: 'Designing a MERN Portfolio That Feels Like a Product',
    slug: 'mern-portfolio-like-a-product',
    category: 'Tutorial',
    tags: ['MERN', 'Design', 'Portfolio', 'TypeScript'],
    readTime: 8,
    publishedAt: '2026-03-24',
    coverImage: '',
    featured: true,
    content: `# Designing a MERN Portfolio That Feels Like a Product

A developer portfolio should do more than list projects. It should behave like a focused product: fast, structured, accessible, and easy to explore.

## Information Architecture

I like this order:

- Hero for positioning.
- About for credibility.
- Projects for proof.
- Skills for scanability.
- Writing for depth.
- Contact for conversion.

Each section should answer a different question.

## Frontend Foundation

React, TypeScript, Tailwind, Framer Motion, and route-level pages create a strong base. The key is restraint: motion should clarify the interface, not distract from it.

## Backend Role

The backend should own dynamic content like blogs, projects, and contact messages. Static information such as skills can stay in frontend data files until it truly needs a CMS.

\`\`\`ts
app.use('/api/blogs', blogRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/contact', contactRoutes)
\`\`\`

## Final Thought

The best portfolio is not the loudest one. It is the one that makes your work easy to trust.`,
  },
  {
    _id: 'blog-open-source',
    title: 'Preparing for Open Source Programs as a Student',
    slug: 'preparing-for-open-source-programs',
    category: 'Open Source',
    tags: ['Open Source', 'GSoC', 'LFX', 'Community'],
    readTime: 6,
    publishedAt: '2026-02-12',
    coverImage: '',
    featured: false,
    content: `# Preparing for Open Source Programs as a Student

Open source programs reward preparation long before the application opens.

## Start With Repository Fit

A good repository is active, beginner-readable, and aligned with your skills. Look for recent merged PRs, issue discussions, and clear contribution docs.

## Build Trust Early

Start small:

- Reproduce a bug.
- Improve docs.
- Add a focused test.
- Ask precise questions.

Small useful contributions compound faster than one oversized unfinished PR.

## Proposal Quality

A strong proposal explains the problem, current behavior, planned milestones, risks, and communication rhythm.

Mentors are not only choosing an idea. They are choosing whether they can trust your execution.`,
  },
]

export const BLOG_CATEGORIES = ['All', 'Tutorial', 'Career', 'Open Source', 'Projects', 'Opinion']
