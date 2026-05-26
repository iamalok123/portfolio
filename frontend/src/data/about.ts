import { BrainCircuit, Code2, Trophy } from 'lucide-react'

export const ABOUT_CONTENT = {
  label: '// about_me',
  heading: 'The Developer\nBehind The Screen.',
  bio: [
    'I am Alok Hotta, a final-year Computer Science student at Gandhi Engineering College, Bhubaneswar, focused on building Full-Stack AI products that feel fast, useful, and reliable.',
    'My work moves across Next.JS, React, Node.JS, Express.JS, Python, PostgreSQL, MongoDB, and AI integrations. I enjoy turning rough product ideas into real shipped interfaces and APIs.',
    'Outside product work, I sharpen my problem-solving through competitive programming as a LeetCode Knight with 700+ problems solved, and I led a 6-member team to 1st place in college internal hackathon for Smart India Hackathon 2025.',
  ],
  currentBuild: 'Zephyr - AI Website Builder',
}

export const ABOUT_STATS = [
  { value: 700, suffix: '+ CP', label: 'Problems Solved' },
  { value: 8.9, suffix: '', label: 'CGPA', decimals: 1 },
  { value: 1, suffix: 'st Place', label: 'In COLLEGE SIH 2025' },
  { value: 5, suffix: '+', label: 'Projects Shipped' },
]

export const CAPABILITIES = [
  {
    title: "Full-Stack AI Developer",
    description: "Next.js, React, Express.js, MongoDB, and PostgreSQL systems.",
    Icon: Code2,
  },
  {
    title: "AI/ML Integration",
    description: "RAG, LangChain, vector DBs, and product workflows.",
    Icon: BrainCircuit,
  },
  {
    title: "Competitive Programming",
    description: "C++, Knight at LeetCode , and contest-grade problem solving.",
    Icon: Trophy,
  },
];
