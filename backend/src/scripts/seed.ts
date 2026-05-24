/**
 * MongoDB Seed Script
 * Run with: node --loader ts-node/esm src/scripts/seed.ts
 * Make sure MONGO_URI is set in your .env file
 */

import 'dotenv/config'
import { connectDB } from '../config/db.js'
import { Blog } from '../models/Blog.js'
import { Project } from '../models/Project.js'

const PROJECTS = [
  {
    title: 'Zephyr — AI Website Builder',
    desc: 'An AI-powered website builder that generates production-ready Next.js sites from natural language prompts. Uses LangChain, OpenAI, and Pinecone for RAG-based code generation.',
    tags: ['AI/ML', 'Full-Stack'],
    techStack: ['Next.js', 'TypeScript', 'LangChain', 'OpenAI', 'Pinecone', 'MongoDB'],
    liveUrl: 'https://zephyr.demo',
    githubUrl: 'https://github.com/alok/zephyr',
    featured: true,
    order: 1,
  },
  {
    title: 'StudyFlow',
    desc: 'A collaborative study platform with real-time whiteboard, Pomodoro timer, and AI-generated flashcards from uploaded PDFs. Built for students, by a student.',
    tags: ['Full-Stack'],
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'OpenAI API'],
    liveUrl: 'https://studyflow.demo',
    githubUrl: 'https://github.com/alok/studyflow',
    featured: true,
    order: 2,
  },
  {
    title: 'ByteChat',
    desc: 'A real-time messaging app with end-to-end encryption, group chats, file sharing, and read receipts. Supports 10k+ concurrent connections via Socket.io clustering.',
    tags: ['Full-Stack'],
    techStack: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis'],
    liveUrl: 'https://bytechat.demo',
    githubUrl: 'https://github.com/alok/bytechat',
    featured: false,
    order: 3,
  },
  {
    title: 'CodeLens — AI Code Reviewer',
    desc: 'VS Code extension that provides AI-powered code review, suggests refactors, detects bugs, and explains complex code in plain English using GPT-4.',
    tags: ['AI/ML', 'Open Source'],
    techStack: ['TypeScript', 'VS Code API', 'OpenAI', 'Node.js'],
    liveUrl: 'https://marketplace.visualstudio.com',
    githubUrl: 'https://github.com/alok/codelens',
    featured: false,
    order: 4,
  },
  {
    title: 'Portfolio v3',
    desc: 'This very portfolio! Built with React, Vite, Framer Motion, and a Node.js + MongoDB backend. Dark-first design with neon lime accent, custom cursor, and cinematic loading screen.',
    tags: ['Frontend', 'Open Source'],
    techStack: ['React', 'TypeScript', 'Framer Motion', 'Node.js', 'MongoDB'],
    liveUrl: 'https://alok.dev',
    githubUrl: 'https://github.com/alok/portfolio',
    featured: false,
    order: 5,
  },
]

const BLOGS = [
  {
    title: 'Building an AI Website Builder with LangChain and Next.js',
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

> "The best way to learn AI engineering is to build something real with it." — Me, probably.

## What's Next

- Support for React Native mobile apps
- Integration with Vercel for one-click deployment
- Custom design system generation
`,
    tags: ['AI/ML', 'LangChain', 'Next.js', 'RAG'],
    category: 'Tutorial',
    readTime: 8,
    publishedAt: new Date('2025-03-15'),
    featured: true,
  },
  {
    title: 'How I Won Smart India Hackathon 2025 as a Team Lead',
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
    featured: true,
  },
  {
    title: 'From 0 to LeetCode Knight: My Competitive Programming Journey',
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
    featured: false,
  },
]

async function seed() {
  console.log('🌱 Connecting to MongoDB...')
  await connectDB()

  console.log('🗑️  Clearing existing data...')
  await Promise.all([Project.deleteMany({}), Blog.deleteMany({})])

  console.log('📦 Seeding projects...')
  const projects = await Project.insertMany(PROJECTS)
  console.log(`✅ Inserted ${projects.length} projects`)

  console.log('📝 Seeding blogs...')
  const blogs = await Blog.insertMany(BLOGS)
  console.log(`✅ Inserted ${blogs.length} blog posts`)

  console.log('\n🎉 Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
