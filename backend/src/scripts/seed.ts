/**
 * Portfolio content seed
 *
 * Run from backend:
 *   npm run seed
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * HOW TO UPDATE CONTENT
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 1. Projects: edit PROJECTS below. `order` controls display order. `tags`
 *    drive the project filters. `techStack` drives the small tech bubbles.
 *
 * 2. Project images: put files in backend/assets/project and use
 *    projectImage('file-name.png'). Leave coverImage empty for the frontend
 *    fallback artwork.
 *
 * 3. Blogs: edit BLOGS below. `slug` controls the URL: /blog/your-slug.
 *    Keep slugs stable when updating a post so old links keep working.
 *
 * 4. Blog images: put files in backend/assets/blog and use
 *    blogImage('file-name.png'). Leave coverImage empty for fallback artwork.
 *
 * 5. This file is the source of truth. Records removed from PROJECTS/BLOGS
 *    are removed from the database the next time this seed runs.
 *
 * Make sure MONGO_URI is set in your .env file before running.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * BLOG CONTENT GUIDE — Heading Rules for the Capsule TOC
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Blog content is Markdown. The heading structure directly drives the floating
 * capsule table-of-contents (TOC) on the blog detail page.
 *
 * HEADING HIERARCHY:
 * ──────────────────
 *   # Title           → Rendered as the page <h1>. Stripped from the article
 *                        body automatically. Every post MUST start with this.
 *
 *   ## Section         → Main sections. These appear as TOP-LEVEL items in the
 *                        capsule TOC. Use these to divide the post into major
 *                        ideas. Aim for 4–10 per post for a useful TOC.
 *
 *   ### Subsection     → Child items. These appear INDENTED under their parent
 *                        ## in the capsule TOC. Use these to break a section
 *                        into focused points.
 *
 * RULES:
 * ──────
 *   ✓  Every ## and ### heading text MUST be unique within the post.
 *      (Duplicate text creates duplicate slugs and breaks TOC navigation.)
 *
 *   ✓  Use at least 4 ## headings so the capsule TOC is navigable.
 *
 *   ✓  Keep heading text short (2–6 words). Long headings truncate in the
 *      capsule pill.
 *
 *   ✓  Place a blank line before and after every heading.
 *
 *   ✗  Do NOT use #### or deeper — the TOC only tracks ## and ###.
 *
 *   ✗  Do NOT put markdown formatting inside headings (bold, code, links).
 *
 * FENCED CODE BLOCKS:
 * ───────────────────
 *   Wrap code in triple backticks with a language tag. The UI adds a copy
 *   button automatically.
 *
 *   ```ts
 *   const x = 1
 *   ```
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * NEW BLOG TEMPLATE — Copy and paste this into the BLOGS array
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *   {
 *     title: 'Your Post Title',
 *     slug: 'your-post-title',
 *     tags: ['Tag1', 'Tag2'],
 *     readTime: 6,
 *     publishedAt: new Date('2026-06-01'),
 *     coverImage: '',
 *     content: `# Your Post Title
 *
 * Opening paragraph — hook the reader in 1–2 sentences.
 *
 * ## First Main Section
 *
 * Content for this section.
 *
 * ## Second Main Section
 *
 * Content for this section.
 *
 * ### A Subsection
 *
 * Deeper detail under the second section.
 *
 * ## Third Main Section
 *
 * Content for this section.
 *
 * ## Closing Section
 *
 * Wrap up the post with a takeaway.`,
 *   },
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import 'dotenv/config'
import { connectDB, isDBConnected } from '../config/db.js'
import { Blog } from '../models/Blog.js'
import { Project } from '../models/Project.js'

type ProjectSeed = {
  title: string
  desc: string
  tags: string[]
  techStack: string[]
  liveUrl: string
  githubUrl: string
  coverImage?: string
  image?: string
  order: number
}

type BlogSeed = {
  title: string
  slug: string
  content: string
  tags: string[]
  readTime: number
  publishedAt: Date
  coverImage?: string
  image?: string
}

const assetPath = (folder: 'blog' | 'project', fileName: string) => `/assets/${folder}/${fileName}`
const projectImage = (fileName: string) => assetPath('project', fileName)
const blogImage = (fileName: string) => assetPath('blog', fileName)

const withImageAlias = <T extends { coverImage?: string; image?: string }>(item: T): T => {
  const image = item.coverImage || item.image || ''
  return { ...item, coverImage: image, image }
}

const PROJECTS: ProjectSeed[] = [
  {
    title: 'Zephyr',
    desc: 'AI website builder that turns prompts into editable, production-minded web experiences.',
    tags: ['AI/ML', 'Full-Stack'],
    techStack: ['All', 'TypeScript', 'React', 'Node.js', 'LangChain', 'MongoDB'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    coverImage: projectImage('zephyr.png'),
    order: 1,
  },
  {
    title: 'StudyFlow',
    desc: 'Student productivity workspace with notes, reminders, smart planning, and progress insights.',
    tags: ['Full-Stack'],
    techStack: ['React', 'Express', 'MongoDB', 'Tailwind'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    coverImage: projectImage('studyflow.png'),
    order: 2,
  },
  {
    title: 'ByteChat',
    desc: 'Realtime chat app with authentication, presence states, and responsive conversation views.',
    tags: ['Full-Stack', 'Frontend'],
    techStack: ['React', 'Socket.io', 'Node.js', 'Redis'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    coverImage: '',
    order: 3,
  },
  {
    title: 'Codefolio',
    desc: 'Developer profile dashboard that turns coding activity into sharp portfolio-ready cards.',
    tags: ['Frontend', 'Open Source'],
    techStack: ['TypeScript', 'Vite', 'Tailwind', 'GitHub API'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    coverImage: '',
    order: 4,
  },
  {
    title: 'RAG Notes',
    desc: 'Document Q&A workspace with chunking, embeddings, citations, and searchable study notes.',
    tags: ['AI/ML', 'Full-Stack'],
    techStack: ['OpenAI API', 'Pinecone', 'Node.js', 'React'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    coverImage: '',
    order: 5,
  },
  {
    title: 'OSS Kit',
    desc: 'Reusable issue triage and contribution starter utilities for open-source maintainers.',
    tags: ['Open Source'],
    techStack: ['TypeScript', 'GitHub Actions', 'Node.js'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    coverImage: '',
    order: 6,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// BLOGS
// ═══════════════════════════════════════════════════════════════════════════════

const BLOGS: BlogSeed[] = [
  // ─── Blog 1 ────────────────────────────────────────────────────────────────
  {
    title: "AI Can't Save Bad Engineering",
    slug: 'ai-cant-save-bad-engineering',
    tags: ['AI', 'Engineering', 'Systems', 'Fundamentals'],
    readTime: 9,
    publishedAt: new Date('2026-05-25'),
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

The responsibility is still yours.

## How I Use AI Without Losing Ownership

I like using AI as a second pair of hands, not as the driver.

Before asking for code, I write down the shape of the problem: what data enters, what data leaves, which files own the behavior, and what could break if I am wrong.

Then I ask for options, not final answers.

The difference is important. Options keep the decision with the engineer. Final answers make it too easy to paste code that does not belong in the system.

## Review Is Where Engineering Happens

The real test of generated code is the review.

I look for these things:

- Does the change fit the existing architecture?
- Does it make state ownership clearer or more confusing?
- Does it handle failure cases explicitly?
- Is the behavior easy to test?
- Will another developer understand the decision next month?

When the answer is no, I rewrite the patch until it feels native to the project.

## The Standard I Want

AI should make good engineers faster.

It should not make unclear thinking look productive.

The goal is not to avoid tools. The goal is to keep your judgment sharp while using powerful tools well.`,
  },

  // ─── Blog 2 ────────────────────────────────────────────────────────────────
  {
    title: 'How I Approach LeetCode Without Burning Out',
    slug: 'leetcode-without-burning-out',
    tags: ['DSA', 'C++', 'LeetCode', 'Habits'],
    readTime: 5,
    publishedAt: new Date('2026-04-18'),
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

The point is not to grind forever. The point is to become reliable under pressure.

## Review Days Matter

Review days are where most growth happens for me.

If I solve a problem once and never revisit it, I usually remember the feeling of the solution but not the reasoning. When I revisit it after a few days, I can see whether the pattern actually stuck.

### What I Note After Each Failure

I keep a short note for every failed problem:

- What was the missed observation?
- Which constraint mattered most?
- What pattern would have revealed the solution earlier?
- What bug did I introduce during implementation?

These notes are more useful than raw problem counts.

## Contest Pressure

Contests expose different weaknesses than practice.

In practice, I can spend unlimited time polishing a solution. In a contest, I need to choose when to continue, when to skip, and when to protect the score I already have.

That pressure teaches decision-making.

### Upsolving After Contests

The best contest habit I have built is simple: after the contest, I upsolve only the problems that teach a reusable idea. Not every missed problem deserves equal time.

## My Current Rule

I would rather solve fewer problems and deeply understand them than chase a streak that makes me tired.

Consistency should create confidence, not anxiety.`,
  },

  // ─── Blog 3 ────────────────────────────────────────────────────────────────
  {
    title: 'Designing a MERN Portfolio That Feels Like a Product',
    slug: 'mern-portfolio-like-a-product',
    tags: ['MERN', 'Design', 'Portfolio', 'TypeScript'],
    readTime: 8,
    publishedAt: new Date('2026-03-24'),
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

## Content Ownership

One architecture decision matters a lot: dynamic content should have one source of truth.

If projects live in frontend mock files and also in backend seed files, the UI starts lying. One page shows one reality, another page shows another. That is not just messy code; it creates a confusing editing workflow.

### Where Each Type Belongs

For this portfolio, I prefer:

- Backend seed for projects and writing.
- Frontend data files for stable profile content.
- API calls for anything that behaves like content.
- Shared TypeScript types for the frontend contract.

That keeps the design flexible without turning the portfolio into a full CMS too early.

## Product Details

Small details make the site feel built instead of assembled.

The writing page should filter smoothly. Project cards should have consistent metadata. The article page should make long posts easy to navigate. Loading and empty states should still look intentional.

None of these details are individually impressive.

Together, they make the portfolio feel trustworthy.

## Final Thought

The best portfolio is not the loudest one. It is the one that makes your work easy to trust.`,
  },

  // ─── Blog 4 ────────────────────────────────────────────────────────────────
  {
    title: 'Preparing for Open Source Programs as a Student',
    slug: 'preparing-for-open-source-programs',
    tags: ['Open Source', 'GSoC', 'LFX', 'Community'],
    readTime: 6,
    publishedAt: new Date('2026-02-12'),
    coverImage: '',
    content: `# Preparing for Open Source Programs as a Student

Open source programs reward preparation long before the application opens.

## Start With Repository Fit

A good repository is active, beginner-readable, and aligned with your skills. Look for recent merged PRs, issue discussions, and clear contribution docs.

### Signals of a Healthy Repo

Before you invest time, check for these:

- Recent merged pull requests from outside contributors.
- Maintainer responses on issues within a reasonable timeframe.
- A CONTRIBUTING.md or clear setup instructions.
- Tests or at least repeatable checks.

These signals tell you whether your effort has a reasonable chance of landing.

## Build Trust Early

Start small:

- Reproduce a bug.
- Improve docs.
- Add a focused test.
- Ask precise questions.

Small useful contributions compound faster than one oversized unfinished PR.

### From Small PRs to Real Trust

Trust with maintainers is built over weeks, not in a single large patch. Each small, well-scoped contribution shows that you can follow the project's workflow, communicate clearly, and ship reliably.

By the time applications open, you should already be a familiar name in the repository.

## Proposal Quality

A strong proposal explains the problem, current behavior, planned milestones, risks, and communication rhythm.

Mentors are not only choosing an idea. They are choosing whether they can trust your execution.

### What Makes a Proposal Stand Out

- A clear problem statement grounded in the codebase.
- Milestones that are specific and testable.
- Honest risk assessment with mitigation plans.
- Evidence that you have already explored the relevant code.

## Timeline and Commitment

Be realistic about the time you can dedicate. Overcommitting in the proposal and underdelivering during the program is the most common failure mode.

Plan for unexpected complexity. The first milestone always takes longer than you think.

## After the Program

The program is a beginning, not an end. The best participants continue contributing, reviewing, and mentoring others in the community long after the program finishes.`,
  },

  // ─── Blog 5 ────────────────────────────────────────────────────────────────
  {
    title: 'Backend-First Content Architecture for a Portfolio',
    slug: 'backend-first-content-architecture',
    tags: ['Backend', 'MongoDB', 'API', 'Architecture'],
    readTime: 7,
    publishedAt: new Date('2026-01-28'),
    coverImage: '',
    content: `# Backend-First Content Architecture for a Portfolio

A portfolio can start as static data, but it should not stay that way forever.

Once projects and blog posts become editable content, the backend should own them. The frontend should render the experience, not carry a second copy of the same data.

## The Problem With Duplicate Data

Duplicate data feels harmless at first.

One file has project cards for the homepage. Another seed file has projects for the API. Then the UI changes, the seed is forgotten, and the backend starts returning a different portfolio than the frontend preview.

### Three Problems It Creates

That split creates three problems:

- The editing workflow becomes unclear.
- The API contract becomes untrusted.
- The deployed site depends on whichever data path a page happens to use.

The fix is simple: choose one owner.

## Seed Files as Content Source

For a personal portfolio, a seed file is often enough.

It gives you version control, reviewable changes, repeatable local setup, and no admin dashboard to maintain. You can still migrate later to a CMS or editor when the content volume demands it.

### Discipline Over Tooling

The important part is discipline.

If content is dynamic, the frontend should fetch it.

If content is static identity information, the frontend can keep it locally.

## API Shape

I prefer boring API shapes:

\`\`\`ts
GET /api/projects
GET /api/blogs
GET /api/blogs/:slug
\`\`\`

The frontend should not know how content is stored. It only needs stable fields: title, slug, tags, read time, publish date, markdown content, and image paths.

## Frontend Responsibility

The frontend still has real work.

It owns:

- Loading states.
- Empty states.
- Filtering.
- Responsive cards.
- Article navigation.
- Asset URL resolution.

But it should not own the actual blog records.

## Why This Scales

This approach is small, but it scales surprisingly far.

You can add search, pagination, markdown rendering, image assets, and scheduled content without changing the basic mental model.

The backend owns content.

The frontend owns experience.`,
  },

  // ─── Blog 6 ────────────────────────────────────────────────────────────────
  {
    title: 'Designing RAG Notes That Actually Help Students',
    slug: 'designing-rag-notes-for-students',
    tags: ['AI', 'RAG', 'Product', 'StudyFlow'],
    readTime: 8,
    publishedAt: new Date('2025-12-18'),
    coverImage: '',
    content: `# Designing RAG Notes That Actually Help Students

RAG sounds technical, but the product question is simple: can a student trust the answer?

If the answer is fast but vague, it does not help. If it sounds confident but cannot point back to the source, it is dangerous. A useful study assistant needs retrieval, citations, and a workflow that matches how students actually revise.

## Start With the Study Flow

Students do not upload a PDF because they want embeddings.

They upload it because they have a test, a confusing chapter, or a deadline.

### The Loop That Matters

The product should support that flow:

- Upload notes.
- Ask a focused question.
- See a short answer.
- Jump to the source paragraph.
- Save useful answers for revision.

The AI is only one part of the loop.

## Chunking Is a Product Decision

Chunking is not just backend plumbing.

If chunks are too large, answers become noisy. If chunks are too small, context disappears. For study material, I like chunks that preserve headings, examples, and definitions together.

A good chunk should feel like a meaningful study card.

## Citations Build Trust

Every answer should show where it came from.

That does two things:

First, it lets the student verify the response.

Second, it teaches the student where to look in the original material.

### Good Citations vs Bad Citations

The best study tools do not replace reading. They reduce the cost of finding the right place to read.

A bad citation links to a 40-page PDF. A good citation links to the exact paragraph and highlights the relevant sentence.

## Failure States

A RAG app should be honest when it does not know.

If retrieval confidence is weak, the UI should say so. If the document does not contain the answer, the system should avoid inventing one.

Honest failure is better than polished hallucination.

## The Goal

The goal is not a chatbot.

The goal is a study workspace where AI helps students move from confusion to understanding with the source still visible.`,
  },

  // ─── Blog 7 ────────────────────────────────────────────────────────────────
  {
    title: 'What I Look For Before Contributing to Open Source',
    slug: 'what-i-check-before-open-source-contribution',
    tags: ['Open Source', 'GitHub', 'Community', 'Career'],
    readTime: 6,
    publishedAt: new Date('2025-11-07'),
    coverImage: '',
    content: `# What I Look For Before Contributing to Open Source

Before I contribute to a repository, I read the project like a product.

The code matters, but the health of the community matters too. A technically interesting repository can still be a bad place to start if issues are stale, maintainers are absent, or contribution paths are unclear.

## Repository Health

I check a few signals first:

- Recent merged pull requests.
- Maintainer responses on issues.
- Clear setup instructions.
- Tests or at least repeatable checks.
- Issues with enough context to reproduce.

These signals tell me whether my effort has a reasonable chance of becoming useful.

## Start Smaller Than You Want

The first contribution should usually be small.

That does not mean meaningless. It means focused.

A documentation fix, a reproduced bug, a small test, or a narrow UI improvement can teach you the project workflow without overwhelming the maintainers.

Trust compounds.

## Read Before Asking

Good questions come from reading.

Before asking for help, I try to understand the folder structure, the failing behavior, and what I have already attempted. A precise question is easier to answer and shows respect for the maintainer's time.

## The Pull Request Shape

A strong pull request explains:

- What changed.
- Why it changed.
- How it was tested.
- What tradeoff was made.

The code is only part of the contribution. The explanation is what helps maintainers review it confidently.

## Long-Term Mindset

Open source is not just about getting merged.

It is about learning how real teams communicate through code, reviews, issues, and constraints.

That skill is valuable far beyond one repository.`,
  },

  // ─── Blog 8 ────────────────────────────────────────────────────────────────
  {
    title: 'Building Realtime Features Without Making the UI Chaotic',
    slug: 'building-realtime-features-without-chaos',
    tags: ['Realtime', 'Frontend', 'Socket.io', 'UX'],
    readTime: 7,
    publishedAt: new Date('2025-10-02'),
    coverImage: '',
    content: `# Building Realtime Features Without Making the UI Chaotic

Realtime features are exciting because they make software feel alive.

They are also easy to overdo.

If every event creates motion, badges, sounds, and layout changes, the interface becomes stressful. A good realtime UI should make updates visible without stealing the user's focus.

## Decide What Deserves Attention

Not every event is equally important.

A new message in the active chat should appear immediately. A typing indicator can be subtle. A presence update can be quiet. A background sync should often be invisible.

The UI should reflect priority.

## Stable Layouts Matter

Realtime data can cause layout jumps.

Messages arrive. Counts change. Avatars appear. Status labels update.

### Preventing Layout Shifts

The solution is to reserve space for common dynamic elements and avoid using content size as the only layout rule. Stable dimensions make the app feel calm even while data is changing.

## Optimistic UI

Optimistic UI can make a product feel fast, but it needs an honest rollback path.

When a user sends a message, I like showing it immediately with a pending state. If the server confirms it, the pending state disappears. If it fails, the message stays visible with a retry action.

Never silently lose user input.

## Connection States

Realtime apps need clear connection states:

- Connected.
- Reconnecting.
- Offline.
- Failed to send.

These states should be visible but not dramatic.

## The Best Realtime UI

The best realtime UI feels predictable.

It updates quickly, but it does not surprise the user. It keeps the page steady, preserves context, and only asks for attention when attention is actually needed.`,
  },

  // ─── Blog 9 ────────────────────────────────────────────────────────────────
  {
    title: 'Frontend Polish That Makes Developer Tools Feel Professional',
    slug: 'frontend-polish-for-developer-tools',
    tags: ['Frontend', 'Design', 'React', 'UX'],
    readTime: 6,
    publishedAt: new Date('2025-09-14'),
    coverImage: '',
    content: `# Frontend Polish That Makes Developer Tools Feel Professional

Developer tools do not need to be flashy.

They need to be clear, fast, and predictable. The best interfaces for technical users respect attention. They let people scan, compare, decide, and move.

## Density With Order

A developer tool can show a lot of information, but it needs hierarchy.

I like using compact typography, restrained borders, and clear spacing instead of oversized cards everywhere. The interface should feel dense enough for work but not crowded.

## Controls Should Match Intent

Buttons are for actions.

Tabs are for views.

Toggles are for binary settings.

Menus are for option sets.

When controls match user expectations, the UI feels easier without needing extra explanation.

## Motion Should Clarify

Motion is useful when it explains where something came from or what changed.

It becomes distracting when every hover, filter, and page transition competes for attention. In tools, I prefer short transitions and stable layouts.

## Empty States

Empty states should be useful.

They should tell the user what happened and what action is available next. They should not feel like marketing panels inside a work surface.

## The Professional Feeling

Professional UI is not only about colors.

It is about confidence.

The user should feel that the interface will not jump, hide important information, or waste their time.`,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Sync logic — do not edit unless changing the seed strategy.
// ═══════════════════════════════════════════════════════════════════════════════

async function syncProjects() {
  const projects = PROJECTS.map(withImageAlias).sort((a, b) => a.order - b.order)
  const projectTitles = projects.map((project) => project.title)

  await Project.deleteMany({ title: { $nin: projectTitles } })

  const updatedProjects = await Promise.all(
    projects.map((project) =>
      Project.findOneAndUpdate(
        { title: project.title },
        { $set: project },
        { returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true, upsert: true },
      ),
    ),
  )

  return updatedProjects.length
}

async function syncBlogs() {
  const blogs = BLOGS.map(withImageAlias).sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
  )
  const blogSlugs = blogs.map((blog) => blog.slug)

  await Blog.deleteMany({ slug: { $nin: blogSlugs } })
  await Blog.updateMany({}, { $unset: { category: 1 } }, { strict: false })

  const updatedBlogs = await Promise.all(
    blogs.map((blog) =>
      Blog.findOneAndUpdate(
        { slug: blog.slug },
        { $set: blog },
        { returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true, upsert: true },
      ),
    ),
  )

  return updatedBlogs.length
}

async function seed() {
  console.log('Connecting to MongoDB...')
  await connectDB()

  if (!isDBConnected()) {
    throw new Error('MongoDB is unavailable. Check MONGO_URI and run the seed again.')
  }

  console.log('Syncing projects from seed.ts...')
  const projectCount = await syncProjects()
  console.log(`Synced ${projectCount} projects`)

  console.log('Syncing blogs from seed.ts...')
  const blogCount = await syncBlogs()
  console.log(`Synced ${blogCount} blog posts`)

  console.log('Seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
