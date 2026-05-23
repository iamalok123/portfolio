import { BrainCircuit, Code2, Trophy } from 'lucide-react'

export const ABOUT_CONTENT = {
  label: '// about_me',
  heading: 'The Developer\nBehind The Screen.',
  bio: [
    'I am Alok Kumar, a third-year Computer Science student at Gandhi Engineering College, Bhubaneswar, focused on building full-stack products that feel fast, useful, and reliable.',
    'My work moves across React, Node.js, databases, and AI integrations. I enjoy turning rough product ideas into real shipped interfaces and APIs.',
    'Outside product work, I sharpen my problem-solving through competitive programming as a LeetCode Knight with 600+ problems solved, and I led a 6-member team to 1st place at Smart India Hackathon 2025.',
  ],
  currentBuild: 'Zephyr - AI Website Builder',
}

export const ABOUT_STATS = [
  { value: 600, suffix: '+', label: 'Problems Solved' },
  { value: 8.9, suffix: '', label: 'CGPA', decimals: 1 },
  { value: 1, suffix: 'st Place', label: 'SIH 2025' },
  { value: 3, suffix: '+', label: 'Projects Shipped' },
]

export const CAPABILITIES = [
  {
    title: 'Full-Stack Dev',
    description: 'React, Node, MongoDB, and PostgreSQL systems.',
    Icon: Code2,
  },
  {
    title: 'AI/ML Integration',
    description: 'RAG, LangChain, vector DBs, and product workflows.',
    Icon: BrainCircuit,
  },
  {
    title: 'Competitive Programming',
    description: 'C++, LeetCode Knight, and contest-grade problem solving.',
    Icon: Trophy,
  },
]
