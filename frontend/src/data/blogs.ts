import type { Blog } from '../types'

export const BLOGS_MOCK: Blog[] = [
  {
    _id: 'blog-ai-bad-engineering',
    title: "AI Can't Save Bad Engineering",
    slug: 'ai-cant-save-bad-engineering',
    category: 'Opinion',
    tags: ['AI', 'Engineering', 'Systems', 'Fundamentals'],
    readTime: 9,
    publishedAt: '2026-05-25',
    coverImage: '',
    content: `# AI Can't Save Bad Engineering

AI tools can't compensate for poor engineering.

## The Shallow Engineer Problem

Let's talk about shallow engineers today.

There are many engineers who are nothing without AI. So let us dive into this.

First, I have noticed a common pattern among many open-source contributors during GSoC.

They can ship features.

They can write thousands of lines of code.

But they do not know what it actually does.

That is one of the major problems when people use AI as a replacement for understanding.

## Understanding Before Code

Good engineering starts before the first line of code.

You need to understand the data model, the failure cases, the user flow, and the constraints of the system. Without that, AI can only generate something that looks useful from a distance.

If you cannot explain the existing architecture, you cannot safely change it.

If you cannot reason about tradeoffs, you cannot review generated code.

If you cannot debug without guessing, the tool is carrying the project instead of helping you.

## The Vibe Coder

The vibe coder moves fast, but only while the path is obvious.

They paste an error into AI.

They accept the first fix.

They add another dependency.

They keep layering changes until the code finally runs.

The result may pass a happy-path demo, but it becomes difficult to maintain because nobody made a real decision. The system is just a pile of plausible suggestions.

## Two Weeks of Wasted Effort

I have seen people spend weeks fixing a problem that would have taken a day if they had first read the code.

They ask AI to modify files they do not understand. Then the generated patch breaks another flow. Then they ask for another patch. Soon the project has multiple half-fixes stacked on top of each other.

The real cost is not the time spent typing prompts.

The real cost is losing the map of the system.

### The Code That Broke

Most bad AI-generated code does not look obviously broken.

It has good variable names.

It has comments.

It may even compile.

But it often misses hidden contracts: authorization rules, cache behavior, edge cases, race conditions, validation boundaries, and long-term readability.

### The Complexity He Missed

Complexity is rarely in the line that changed.

It is in how that line interacts with everything around it.

That is why shallow fixes become expensive. They solve the visible symptom while quietly increasing the system's future maintenance cost.

## What They Lack

The problem is not using AI.

The problem is using AI without fundamentals.

Strong engineers still use AI, but they use it differently. They ask better questions. They reject weak answers. They turn generated code into something that fits the system.

## Decision Bugs

A syntax bug is easy to find.

A decision bug is harder.

It happens when the code technically works, but the design choice is wrong. The API shape is confusing. The state lives in the wrong place. The abstraction hides important behavior. The database query works today but will collapse with real data.

AI can help surface options, but it cannot own the decision for you.

### Symptoms of AI Dependency

- You cannot explain the code you just merged.
- You avoid debugging and immediately ask for a rewrite.
- You add libraries before checking the standard solution.
- You accept patches without understanding the tradeoff.
- You measure progress by generated lines instead of reduced complexity.

## Fundamentals That Matter

Learn how data flows through your app.

Learn how HTTP, databases, authentication, queues, caching, and rendering actually behave.

Learn to read stack traces.

Learn to write small tests.

Learn to delete code.

These fundamentals make AI useful because they give you judgment.

## Maintenance Is the Real Challenge

Shipping the first version is not the hard part.

Maintaining it is.

Real engineering begins when requirements change, users report bugs, performance matters, and someone else has to read what you wrote.

AI can speed up the work, but it cannot save bad engineering.

The tool is powerful.

The responsibility is still yours.`,
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
