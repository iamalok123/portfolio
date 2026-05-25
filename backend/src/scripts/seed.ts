/**
 * Portfolio content seed
 *
 * Run from backend:
 *   npm run seed
 *
 * How to update content:
 * 1. Projects: edit PROJECTS below. `order` controls display order. `tags`
 *    drive the project filters. `techStack` drives the small tech bubbles.
 * 2. Project images: put files in backend/assets/project and use
 *    projectImage('file-name.png'). Leave coverImage empty for the frontend
 *    fallback artwork.
 * 3. Blogs: edit BLOGS below. `slug` controls the URL: /blog/your-slug.
 *    Keep slugs stable when updating a post so old links keep working.
 * 4. Blog images: put files in backend/assets/blog and use
 *    blogImage('file-name.png'). Leave coverImage empty for fallback artwork.
 * 5. Blog content is Markdown. Headings become the table of contents on the
 *    blog detail page, and fenced code blocks get the copy button in the UI.
 * 6. This file is the source of truth. Records removed from PROJECTS/BLOGS
 *    are removed from the database the next time this seed runs.
 *
 * Make sure MONGO_URI is set in your .env file before running.
 */

import 'dotenv/config'
import { connectDB } from '../config/db.js'
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
  category: string
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
    title: 'Zephyr — AI Website Builder',
    coverImage: projectImage('zephyr.png'),
    desc: 'An AI-powered website builder that generates functional websites from natural language prompts. Uses Typescript, Express.js, and Openrouter API for code generation.',
    tags: ['AI/ML', 'Full-Stack', 'React'],
    techStack: ['React.js', 'TypeScript', 'Inngest', 'Openrouter API', 'Better Auth', 'PostgreSQL'],
    liveUrl: 'https://zephyr.demo',
    githubUrl: 'https://github.com/alok/zephyr',
    order: 1,
  },
  {
    title: 'StudyFlow',
    coverImage: projectImage('studyflow.png'),
    desc: 'A collaborative study platform with real-time whiteboard, Pomodoro timer, and AI-generated flashcards from uploaded PDFs. Built for students, by a student.',
    tags: ['Full-Stack', 'RAG', 'AI/ML'],
    techStack: ['React', 'Node.js', 'RAG', 'MongoDB', 'Gemini API'],
    liveUrl: 'https://studyflow.demo',
    githubUrl: 'https://github.com/alok/studyflow',
    order: 2,
  },
  {
    title: 'ByteChat',
    coverImage: '',
    desc: 'A real-time messaging app with end-to-end encryption, group chats, file sharing, and read receipts. Supports 10k+ concurrent connections via Socket.io clustering.',
    tags: ['Full-Stack'],
    techStack: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis'],
    liveUrl: 'https://bytechat.demo',
    githubUrl: 'https://github.com/alok/bytechat',
    order: 3,
  },
  {
    title: 'CodeLens — AI Code Reviewer',
    coverImage: '',
    desc: 'VS Code extension that provides AI-powered code review, suggests refactors, detects bugs, and explains complex code in plain English using GPT-4.',
    tags: ['AI/ML', 'Open Source'],
    techStack: ['TypeScript', 'VS Code API', 'OpenAI', 'Node.js'],
    liveUrl: 'https://marketplace.visualstudio.com',
    githubUrl: 'https://github.com/alok/codelens',
    order: 4,
  },
  {
    title: 'Portfolio v3',
    coverImage: '',
    desc: 'This very portfolio! Built with React, Vite, Framer Motion, and a Node.js + MongoDB backend. Dark-first design with neon lime accent, custom cursor, and cinematic loading screen.',
    tags: ['Frontend', 'Open Source'],
    techStack: ['React', 'TypeScript', 'Framer Motion', 'Node.js', 'MongoDB'],
    liveUrl: 'https://alokhotta.site',
    githubUrl: 'https://github.com/alok/portfolio',
    order: 5,
  },
]

const BLOGS: BlogSeed[] = [
  {
    title: 'Building an AI Website Builder with LangChain and Next.js',
    slug: 'building-ai-website-builder-langchain-nextjs',
    coverImage: '',
    content: `# Building an AI Website Builder with LangChain and Next.js

## Introduction

In this post, I'll walk you through how I built Zephyr — an AI-powered website builder that generates production-ready Next.js sites from natural language prompts.

## The Architecture

The system uses a RAG (Retrieval Augmented Generation) pipeline:

1. **Input**: User describes their website in plain English
2. **Retrieval**: Similar site templates are retrieved from Pinecone
3. **Generation**: GPT-4 generates the code with context from retrieved templates
4. **Execution**: The generated code is sandboxed and previewed in real-time

\`\`\`typescript
const chain = new RetrievalQAChain({
  llm: new OpenAI({ modelName: 'gpt-4' }),
  retriever: vectorStore.asRetriever(),
})

const result = await chain.call({
  query: userPrompt,
})
\`\`\`

## Key Challenges

### 1. Code Hallucination
GPT-4 sometimes generates syntactically incorrect code. I solved this by:
- Adding a validation step that runs TypeScript compiler checks
- Implementing retry logic with error feedback to the model

### 2. Template Retrieval Quality
The quality of RAG output heavily depends on embedding quality. I used OpenAI's \`text-embedding-3-large\` model and chunked templates at the component level.

## Results

The system can generate a fully functional 5-page Next.js website in under 30 seconds. Test it at [zephyr.demo](https://zephyr.demo).

## What's Next

- Support for React Native mobile apps
- Integration with Vercel for one-click deployment
- Custom design system generation
`,
    tags: ['AI/ML', 'LangChain', 'Next.js', 'RAG'],
    category: 'Tutorial',
    readTime: 8,
    publishedAt: new Date('2025-03-15'),
  },
  {
    title: 'How I Won Smart India Hackathon 2025 as a Team Lead',
    slug: 'smart-india-hackathon-2025-team-lead',
    coverImage: '',
    content: `# How I Won Smart India Hackathon 2025 as a Team Lead

## The Beginning

SIH (Smart India Hackathon) is the largest hackathon in India with over 50,000 participants. In 2025, I led a team of 6 to win 1st place at the national level.

## Our Problem Statement

We were assigned to solve: **"Efficient management of agricultural supply chains using AI and IoT"**

## Our Solution: AgriLink

AgriLink is an end-to-end platform that:

1. Uses IoT sensors to monitor crop health in real-time
2. Predicts optimal harvest times using ML models
3. Connects farmers directly to buyers, cutting out middlemen
4. Provides price forecasting based on market trends

## The Tech Stack

\`\`\`
Frontend: React + TypeScript + Tailwind
Backend: Node.js + Express + PostgreSQL
ML: Python + FastAPI + scikit-learn
IoT: Arduino + MQTT + InfluxDB
Deployment: AWS EC2 + Docker
\`\`\`

## Key Learnings as a Team Lead

### 1. Divide by Strengths, not by Modules
Instead of assigning "you do frontend, you do backend", I assigned based on what each person was **best** at. This reduced context-switching and increased velocity.

### 2. Ship Early, Polish Late
We had a working MVP by hour 12 of our 36-hour hackathon. The remaining 24 hours were spent on polish and edge cases.

### 3. Demo Script > Feature Count
Judges see hundreds of projects. A clean 3-minute demo beats a feature-rich product with a confusing demo every time.

## The Result

We won 1st place and received ₹1,00,000 in prize money. More importantly, we're now in talks with the Ministry of Agriculture to pilot AgriLink in Odisha.

## What's Next

I'm open-sourcing the core AgriLink platform. Watch this space.
`,
    tags: ['Career', 'Hackathon', 'Leadership'],
    category: 'Career',
    readTime: 6,
    publishedAt: new Date('2025-01-20'),
  },
  {
    title: 'From 0 to LeetCode Knight: My Competitive Programming Journey',
    slug: 'leetcode-knight-competitive-programming-journey',
    coverImage: '',
    content: `# From 0 to LeetCode Knight: My Competitive Programming Journey

## The Beginning

Two years ago, I couldn't solve a simple Two Sum problem without looking at hints. Today, I'm a LeetCode Knight (top 5% globally) with 600+ problems solved.

Here's everything I did, in order.

## Phase 1: Learning DSA from Scratch (Month 1-3)

I followed this exact sequence:

1. **Arrays & Strings** (2 weeks): Two pointers, sliding window
2. **Linked Lists** (1 week): Slow/fast pointers, reversal patterns
3. **Stacks & Queues** (1 week): Monotonic stack, BFS templates
4. **Trees** (2 weeks): DFS/BFS, LCA, BST operations
5. **Dynamic Programming** (4 weeks): This is where most people give up. Don't.

## The DP Breakthrough

DP clicked for me when I stopped thinking about "states" and started thinking about "choices".

For every DP problem, ask: **"What choices do I have at each step?"**

\`\`\`cpp
// Example: Fibonacci (simplest DP)
// Choice: I can reach n from n-1 or n-2
// dp[n] = dp[n-1] + dp[n-2]

vector<int> dp(n + 1);
dp[0] = 0; dp[1] = 1;
for (int i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
}
\`\`\`

## My Daily Routine

- **Morning**: 1 Easy problem (warm-up)
- **Afternoon**: 1 Medium problem (main session)
- **Weekend**: 1 Hard problem + contest

Consistency > intensity. Every. Single. Day.

## Resources That Actually Helped

1. **Neetcode.io** — Best curated problem list, excellent explanations
2. **CSES Problem Set** — For competitive programming beyond LeetCode
3. **Striver's A2Z Sheet** — If you're starting from zero

## The Knight Badge

After ~14 months of consistent practice, I hit Knight tier. The badge is cool, but the real reward is the pattern recognition that kicks in automatically now.

If you're starting out: just start. Do one problem today. Then tomorrow. That's it.
`,
    tags: ['Competitive Programming', 'Career', 'C++'],
    category: 'Career',
    readTime: 7,
    publishedAt: new Date('2024-11-10'),
  },
]

async function syncProjects() {
  const projects = PROJECTS.map(withImageAlias).sort((a, b) => a.order - b.order)
  const projectTitles = projects.map((project) => project.title)

  await Project.deleteMany({ title: { $nin: projectTitles } })

  const updatedProjects = await Promise.all(
    projects.map((project) =>
      Project.findOneAndUpdate(
        { title: project.title },
        { $set: project },
        { new: true, runValidators: true, setDefaultsOnInsert: true, upsert: true },
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

  const updatedBlogs = await Promise.all(
    blogs.map((blog) =>
      Blog.findOneAndUpdate(
        { slug: blog.slug },
        { $set: blog },
        { new: true, runValidators: true, setDefaultsOnInsert: true, upsert: true },
      ),
    ),
  )

  return updatedBlogs.length
}

async function seed() {
  console.log('Connecting to MongoDB...')
  await connectDB()

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
