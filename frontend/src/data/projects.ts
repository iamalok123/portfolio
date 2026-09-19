import type { Project } from '../types'

export const STATIC_PROJECTS: Project[] = [
  {
    _id: "zephyr-ai",
    title: "Zephyr",
    desc: "AI website builder that turns natural language prompts into editable, production-minded web experiences with instant component rendering.",
    techStack: [
      "TypeScript",
      "React",
      "Node.js",
      "Inngest",
      "OpenRouter",
      "PostgreSQL",
    ],
    liveUrl: "https://zephyr-ai-dusky.vercel.app",
    githubUrl: "https://github.com/iamalok123/ai-website-builder-fullstack-PERN",
    coverImage: "/assets/project/zephyr.webp",
    order: 1,
    caseStudy: {
      tagline: "Prompt-driven web generator with durable workflow orchestration",
      problem: "Traditional no-code website builders are either too rigid or produce unmaintainable spaghetti code. Developers and creators need a way to go from idea to clean, componentized, production-ready React code in seconds without dealing with timeout failures on long-running LLM generation.",
      architecture: [
        "Event-Driven Queues with Inngest: De-coupled frontend generation requests from background worker execution to survive Vercel serverless 15-second execution limits.",
        "Multi-Model Routing via OpenRouter: Fallback strategy dynamically routing prompt decomposition and code synthesis between Claude 3.5 Sonnet and Gemini 1.5 Pro.",
        "PostgreSQL + Prisma ORM: Relational schema preserving page version history, design token configurations, and sandbox states.",
        "Sandboxed Live Preview: Isolated iframe runtime rendering generated React code with real-time style injection and error boundaries."
      ],
      challenges: [
        "Handling LLM token streaming timeouts on complex multi-section web apps by implementing chunked streaming and client-side AST patching.",
        "Preventing CSS layout collisions between user components and generator controls using isolated shadow-DOM and custom scoped styles."
      ],
      outcomes: [
        "Reduced end-to-end full landing page generation latency from 35s to under 8s with asynchronous worker pipelines.",
        "Zero-drop generation reliability through Inngest automatic step retries."
      ]
    }
  },
  {
    _id: "studyflow-ai",
    title: "StudyFlow",
    desc: "AI-powered document learning platform with contextual chat, automated quiz generation, flashcards, and interactive visual mindmaps.",
    techStack: [
      "React.js",
      "Express.js",
      "RAG",
      "Gemini",
      "Cloudinary",
      "MongoDB"
    ],
    liveUrl: "https://studyflow-ai-alpha.vercel.app",
    githubUrl: "https://github.com/iamalok123/studyflow-mern-fullstack",
    coverImage: "/assets/project/studyflow.webp",
    order: 2,
    caseStudy: {
      tagline: "High-accuracy retrieval-augmented study companion for technical docs & PDFs",
      problem: "Students and researchers struggle to synthesize 50+ page technical documents, research papers, and lecture notes into active recall materials without hallucination.",
      architecture: [
        "Retrieval-Augmented Generation (RAG): Document parsing and semantic chunking with vector embeddings to ensure answers cite specific page paragraphs.",
        "Gemini 1.5 Pro API: Structured JSON output generation for interactive multiple-choice tests, flashcard decks, and conceptual relationship trees.",
        "MongoDB + Cloudinary: Scalable document store with metadata indexing for instant keyword and semantic retrieval."
      ],
      challenges: [
        "Maintaining citation accuracy on dense academic tables by implementing hybrid vector + keyword BM25 retrieval.",
        "Preventing duplicate flashcards across large textbooks through semantic similarity deduplication."
      ],
      outcomes: [
        "Generates 20-question active recall quizzes and concept mindmaps in under 4 seconds.",
        "Achieved 95%+ citation grounding accuracy with zero hallucinated source pages."
      ]
    }
  },
  {
    _id: "social-ai",
    title: "Social AI",
    desc: "AI-powered social media management platform that helps creators generate content, schedule posts, automate publishing, and collaborate across networks.",
    techStack: [
      "React.js",
      "TypeScript",
      "Node.js",
      "Express.js",
      "Zernio",
      "MongoDB",
      "Cloudinary",
      "Gemini",
      "Cloudflare Workers AI"
    ],
    liveUrl: "https://social-ai-v69.vercel.app",
    githubUrl: "https://github.com/iamalok123/social-ai_mern_fullstack",
    coverImage: "/assets/project/social-ai.webp",
    order: 3,
    caseStudy: {
      tagline: "Autonomous multi-platform content engine with edge AI dispatching",
      problem: "Content creators and digital marketing agencies waste hours manually reformatting, captioning, and scheduling brand updates across fragmented social APIs.",
      architecture: [
        "Edge Inference via Cloudflare Workers AI: Low-latency copy generation and tone adjustment at the network edge before dispatch.",
        "MongoDB Job Queue: Resilient cron-driven scheduling pipeline with exponential backoff on third-party API rate limits.",
        "Role-Based Collaboration: Granular workspace permissions for draft approvals, review comments, and scheduled publish locks."
      ],
      challenges: [
        "Managing diverse rate limits across platform endpoints using token-bucket rate limiting algorithms.",
        "Real-time post status updates across connected clients using lightweight WebSockets."
      ],
      outcomes: [
        "Automated content repurposing workflow reducing marketing distribution time by 70%.",
        "Zero scheduling delivery failures during high-traffic campaign windows."
      ]
    }
  },
  {
    _id: "portfolio-app",
    title: "My Portfolio",
    desc: "A modern, high-performance developer portfolio and technical blog built with React 19, Lenis smooth scrolling, and dynamic Open Graph generation.",
    techStack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Express"
    ],
    liveUrl: "https://www.alokhotta.site",
    githubUrl: "https://github.com/iamalok123/portfolio",
    coverImage: "/assets/project/portfolio.webp",
    order: 4,
    caseStudy: {
      tagline: "Editorial brutalist portfolio with sub-second page loads and offline resilience",
      problem: "Standard developer portfolios often suffer from template conformity, sluggish canvas animations, broken social media previews, and cold-start failures on serverless hosting.",
      architecture: [
        "Physics-Based Scroll with Lenis: Unified wheel interpolation coordinated with Framer Motion layout animations without scroll hijacking.",
        "Serverless Dynamic Open Graph Handler: Dynamic meta injection for Twitter, LinkedIn, and Discord bot previews.",
        "Dual-Layer Fallback Strategy: Client-side static caching guaranteeing instant first paint even during API cold starts."
      ],
      challenges: [
        "Preventing scroll-delay double-animations between browser smooth-scrolling and Lenis physics.",
        "High-contrast dark/light mode token architecture with zero layout shift on hydration."
      ],
      outcomes: [
        "100/100 Lighthouse Best Practices and SEO scores.",
        "Zero-downtime message delivery with dual MongoDB + Nodemailer failover."
      ]
    }
  },
  {
    _id: "kia-media",
    title: "KIA Media",
    desc: "Freelance client project built for KIA Media Networks with clean editorial design and responsive video showcase layouts.",
    techStack: [
      "React",
      "Vite",
      "Tailwind",
      "Framer Motion"
    ],
    liveUrl: "https://kia-mediaworks.vercel.app",
    githubUrl: "https://github.com/iamalok123/kia_media",
    coverImage: "/assets/project/kia-media.webp",
    order: 5,
  },
  {
    _id: "care-iq",
    title: "CareIQ",
    desc: "AI-powered coverage-aware hospital care navigation platform built for the GE HealthCare - Precision Care Hackathon 2026.",
    techStack: [
      "React.js",
      "TypeScript",
      "Supabase - PostgreSQL",
      "Express.js",
      "Gemini"
    ],
    liveUrl: "https://care-iq-v1.vercel.app",
    githubUrl: "https://github.com/iamalok123/Care-IQ",
    coverImage: "/assets/project/careiq.png",
    order: 6,
    caseStudy: {
      tagline: "Coverage-aware hospital navigator matching patient insurance with specialist care",
      problem: "Patients navigate complex hospital networks blindly, often facing surprise out-of-pocket bills and delayed care due to mismatched insurance policies.",
      architecture: [
        "Supabase PostgreSQL + pgvector: Fast semantic search across hospital departments, specialists, and insurer policy tiers.",
        "Gemini Policy Analysis Engine: Parses dense insurance documents to extract exact co-pay rules, pre-authorization criteria, and network tiers."
      ],
      challenges: [
        "Complex multi-tier insurance policy parsing with high accuracy and strict privacy adherence.",
        "Real-time geographic search and bed-availability filters across health networks."
      ],
      outcomes: [
        "Built and submitted for the GE HealthCare Precision Care Hackathon 2026.",
        "Reduced insurance ambiguity with instant eligibility checks in under 2 seconds."
      ]
    }
  },
  {
    _id: "social-ai-nextjs",
    title: "Social AI - NextJS",
    desc: "Next.js 16 social media scheduler leveraging PostgreSQL, Inngest durable workflows, and Clerk multi-tenant authentication.",
    techStack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Inngest",
      "Clerk",
      "shadcn/ui"
    ],
    liveUrl: "https://github.com/iamalok123/social-media-scheduler-nextjs16",
    githubUrl: "https://github.com/iamalok123/social-media-scheduler-nextjs16",
    coverImage: "/assets/project/socialai.webp",
    order: 7,
  },
  {
    _id: "dev-events",
    title: "Dev Events",
    desc: "Modern event management platform with ticket booking, attendee analytics, and interactive event discovery.",
    techStack: [
      "Next.js",
      "React",
      "Tailwind CSS"
    ],
    liveUrl: "https://dev-events-nextjs16-mauve.vercel.app",
    githubUrl: "https://github.com/iamalok123/dev-events-nextjs16",
    coverImage: "/assets/project/dev-events.webp",
    order: 8,
  },
  {
    _id: "expense-tracker",
    title: "Expense Tracker",
    desc: "Personal finance management platform with expense analytics, income tracking, and interactive visual dashboards.",
    techStack: [
      "JavaScript",
      "React.js",
      "Node.js",
      "MongoDB"
    ],
    liveUrl: "https://github.com/iamalok123/expence-tracker-fullstack-mern",
    githubUrl: "https://github.com/iamalok123/expence-tracker-fullstack-mern",
    coverImage: "/assets/project/expence-tracker.webp",
    order: 9,
  },
  {
    _id: "elevate-ai",
    title: "Elevate AI",
    desc: "Professional leadership planning platform prototype featuring mentorship programs, competency tracking, and performance insights.",
    techStack: [
      "JavaScript",
      "React.js",
      "Node.js",
      "MongoDB"
    ],
    liveUrl: "https://elevate-ai-v69.vercel.app",
    githubUrl: "https://github.com/iamalok123/elevate-ai",
    coverImage: "/assets/project/elevate-ai.webp",
    order: 10,
  },
  {
    _id: "bytechat",
    title: "ByteChat",
    desc: "Realtime chat app with authentication, presence states, and responsive conversation views.",
    techStack: [
      "React",
      "Zustand",
      "Socket.io",
      "Node.js",
      "Cloudinary"
    ],
    liveUrl: "https://github.com/iamalok123/realtime_chatapp_mern",
    githubUrl: "https://github.com/iamalok123/realtime_chatapp_mern",
    coverImage: "/assets/project/portfolio.webp",
    order: 11,
  },
  {
    _id: "n-queen",
    title: "N-Queen Visualizer",
    desc: "Interactive visualization of the N-Queen problem with real-time solving and animation in slow and fast motion.",
    techStack: [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    liveUrl: "https://nqueen.netlify.app/",
    githubUrl: "https://github.com/iamalok123/N-Queens-Visualiser-/",
    coverImage: "/assets/project/portfolio.webp",
    order: 12,
  },
  {
    _id: "snake-game",
    title: "Snake Game",
    desc: "A classic Snake game implemented with javascript and modern web technologies.",
    techStack: [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    liveUrl: "https://snake-game-js-v69.vercel.app",
    githubUrl: "https://github.com/iamalok123/Snake-Game-JS",
    coverImage: "/assets/project/portfolio.webp",
    order: 13,
  },
  {
    _id: "currency-converter",
    title: "Currency Converter",
    desc: "Realtime currency conversion app with a clean, modern interface.",
    techStack: [
      "React",
      "JavaScript",
      "Tailwind CSS"
    ],
    liveUrl: "https://currency-converter-69.netlify.app",
    githubUrl: "https://github.com/iamalok123/Currency-Converter-Project-React",
    coverImage: "/assets/project/portfolio.webp",
    order: 14,
  }
]
