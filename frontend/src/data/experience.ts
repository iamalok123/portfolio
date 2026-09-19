import { Award, Briefcase, GitPullRequest, GraduationCap, Medal, Rocket, Trophy, type LucideIcon } from 'lucide-react'

export type ExperienceCategory = 'work' | 'honors' | 'education'

export interface ExperienceItem {
  date: string
  title: string
  detail: string
  tags: string[]
  present: boolean
  category: ExperienceCategory
  Icon: LucideIcon
}

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    date: "2024 - Present",
    title: "Zephyr — AI Website Builder",
    detail: "Engineered prompt-driven React web generator with Inngest durable event orchestration, multi-LLM routing, and AST sandboxed rendering.",
    tags: ["AI", "React", "TypeScript", "Inngest", "PostgreSQL"],
    present: true,
    category: "work",
    Icon: Rocket,
  },
  {
    date: "2024 - 2025",
    title: "Freelance Full-Stack Developer",
    detail: "Delivered bespoke production web applications for clients including KIA Media Works, implementing custom responsive video showcase and editorial UI.",
    tags: ["React", "Next.js", "Tailwind CSS", "Client Delivery"],
    present: false,
    category: "work",
    Icon: Briefcase,
  },
  {
    date: "2025",
    title: "Smart India Hackathon 2025",
    detail: "1st Place Winner | College Level | Team Lead of 6 engineers driving product architecture, pitch, and MVP delivery.",
    tags: ["Hackathon", "1st Place", "Team Lead", "Product"],
    present: false,
    category: "honors",
    Icon: Trophy,
  },
  {
    date: "2026",
    title: "GE HealthCare Hackathon 2026",
    detail: "Architected CareIQ — AI coverage-aware patient navigation platform matching insurance policies with hospital care.",
    tags: ["Healthcare AI", "Supabase", "Gemini 1.5", "Hackathon"],
    present: false,
    category: "honors",
    Icon: Award,
  },
  {
    date: "2024 - Present",
    title: "Knight at LeetCode (Rating 1850+)",
    detail: "Top 4% Globally | Solved 700+ Data Structures & Algorithms challenges with a focus on advanced graphs, dynamic programming, and C++.",
    tags: ["C++", "DSA", "Top 4% Global", "Algorithms"],
    present: true,
    category: "honors",
    Icon: Medal,
  },
  {
    date: "2023 - 2027",
    title: "B.Tech in Computer Science & Engineering",
    detail: "Gandhi Engineering College, Bhubaneswar | Cumulative GPA: 8.9 / 10 | Core Coursework: Data Structures, DBMS, Operating Systems, Computer Networks.",
    tags: ["Computer Science", "CGPA 8.9", "Bhubaneswar", "Core Engineering"],
    present: true,
    category: "education",
    Icon: GraduationCap,
  },
  {
    date: "2024 - Present",
    title: "Open Source Contributor & Dev Community",
    detail: "Contributing to developer tooling, open-source repositories, and participating in global mentorship ecosystems (LFX & GSoC candidate).",
    tags: ["Open Source", "Git", "Community", "GSoC"],
    present: true,
    category: "work",
    Icon: GitPullRequest,
  },
];
