import type { Blog } from '../types'

export const STATIC_BLOGS: Blog[] = [
  {
    _id: "blog-1",
    title: "AI Can't Save Bad Engineering",
    slug: "ai-cant-save-bad-engineering",
    tags: ["AI", "Engineering", "Systems", "Fundamentals"],
    readTime: 12,
    publishedAt: "2026-05-25T00:00:00.000Z",
    coverImage: "/assets/blog/AI_Cant_Save_Bad Engineering.webp",
    content: `# AI Can't Save Bad Engineering
 
There's a version of this conversation happening in every engineering team right now.
 
Someone ships a feature. The feature works. The tests pass. The demo looks great. But three weeks later, the feature breaks something unexpected, the fix introduces another bug, and nobody can explain why the original code made the decisions it did. Not even the person who wrote it.
 
This is the shallow engineer problem. And AI didn't create it — but it has made it significantly easier to be shallow while looking productive.
 
## The Shallow Engineer Problem
 
Let me describe a pattern I've been watching, especially among developers who entered the field after AI coding tools became mainstream.
 
They can ship features. They can write thousands of lines of code. They build projects that look impressive from a distance.
 
But they don't know what their code actually does. Not the business logic, not the failure modes, not the data flow. They know what it produces when things go right. That's a completely different thing from understanding it.
 
> The test of real understanding isn't whether you can make code work. It's whether you can explain exactly why it fails when it does.
 
### The AI Amplification Effect
 
AI tools amplify whatever you bring to them.
 
If you bring engineering judgment, they help you move faster with better decisions. If you bring confusion, they help you produce confused code faster — with better variable names.
 
The problem isn't using AI. The problem is using AI as a **replacement** for understanding rather than as a complement to it.
 
---
 
## Understanding Before Code
 
Good engineering starts before the first line of code. It starts with questions.
 
- What data enters this system?
- What data leaves it, and in what shape?
- What are the failure cases the user will actually encounter?
- Which part of the codebase is responsible for this behavior today?
- What will break if I change the thing I'm about to change?
 
Without those answers, any code you write — AI-generated or hand-typed — is a guess dressed up as an implementation.
 
---
 
## Fundamentals That Actually Matter
 
The fundamentals aren't about memorizing syntax. They're about building mental models that let you use any tool effectively:
 
- **Data flow.** Learn how data moves through your application — from database to API to component state to rendered UI.
- **HTTP and networking.** Learn request lifecycles, headers, caching, and browser execution.
- **Databases.** Understand indexing, transactions, and connection pools.
 
The tool is powerful. The responsibility is still yours.`
  },
  {
    _id: "blog-2",
    title: "How I Approach LeetCode Without Burning Out",
    slug: "leetcode-without-burning-out",
    tags: ["DSA", "C++", "LeetCode", "Habits"],
    readTime: 9,
    publishedAt: "2026-04-18T00:00:00.000Z",
    coverImage: "/assets/blog/ai-2027.webp",
    content: `# How I Approach LeetCode Without Burning Out
 
Competitive programming rewards consistency more than intensity. The difficult part is building a rhythm that survives exams, projects, internship applications, and real life — without turning practice into something you dread.
 
I've gone through multiple cycles of grinding hard, burning out, dropping off for weeks, then rebuilding from scratch. The version of my system that finally stuck is lighter, more deliberate, and significantly less exhausting.
 
## My Core Belief About Practice
 
More problems solved does not mean more skill gained. The relationship between problem count and improvement is not linear — it depends almost entirely on what you do *between* attempts.
 
> A problem you truly understand is worth ten problems you pattern-matched your way through. The first builds a mental model. The second builds a false sense of familiarity.
 
## 3 Non-Negotiable Rules
 
1. **Timer discipline.** Give yourself 25 minutes of uninterrupted whiteboard thinking before looking at any editorial.
2. **Explain the invariant.** Before coding, state the invariant out loud (e.g., "left and right pointers enclose all valid candidate windows").
3. **Spaced repetition.** Re-solve problems 7 days after first solving them without viewing past submissions.`
  },
  {
    _id: "blog-3",
    title: "Engineering a Portfolio That Shows Your Value",
    slug: "engineering-a-portfolio-that-shows-your-value",
    tags: ["Full-Stack", "Architecture", "Portfolio", "Design"],
    readTime: 10,
    publishedAt: "2026-03-12T00:00:00.000Z",
    coverImage: "/assets/blog/transformer.webp",
    content: `# Engineering a Portfolio That Shows Your Value

A portfolio is the only project where you control the entire stack: product definition, frontend architecture, backend performance, visual design, and deployment infrastructure.

Most developer portfolios fail not because the code is bad, but because they communicate like a student assignment rather than an engineering product.

## The Core Principles

1. **Sub-second first contentful paint.** No heavy bloated 3D models unless lazy loaded.
2. **Resilience against failure.** Every API call must have client-side fallbacks for serverless cold-starts.
3. **Deep case studies.** Don't just list tech stacks — show the tradeoffs, architecture decisions, and metrics.`
  }
]
