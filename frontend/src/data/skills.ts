import {
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Layers3,
  PanelsTopLeft,
  Rocket,
  Server,
  Terminal,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

type SkillItem = {
  label: string
  mark: string
  glyph?: 'square' | 'react' | 'tailwind' | 'node' | 'docker' | 'mongodb' | 'vercel' | 'git'
}

type SkillGroup = {
  category: string
  Icon: LucideIcon
  skills: SkillItem[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Languages',
    Icon: Code2,
    skills: [
      { label: 'C', mark: 'C', glyph: 'square' },
      { label: 'C++', mark: 'C++', glyph: 'square' },
      { label: 'Python', mark: 'PY', glyph: 'square' },
      { label: 'JavaScript', mark: 'JS', glyph: 'square' },
      { label: 'TypeScript', mark: 'TS', glyph: 'square' },
      { label: 'SQL', mark: 'SQL', glyph: 'square' },
    ],
  },
  {
    category: 'Frontend',
    Icon: PanelsTopLeft,
    skills: [
      { label: 'React.js', mark: 'R', glyph: 'react' },
      { label: 'Next.js', mark: 'N', glyph: 'square' },
      { label: 'Redux Toolkit', mark: 'RX', glyph: 'square' },
      { label: 'Zustand', mark: 'Z', glyph: 'square' },
      { label: 'Tailwind CSS', mark: 'TW', glyph: 'tailwind' },
      { label: 'Socket.IO', mark: 'IO', glyph: 'square' },
    ],
  },
  {
    category: 'Backend',
    Icon: Server,
    skills: [
      { label: 'Node.js', mark: 'NO', glyph: 'node' },
      { label: 'Express.js', mark: 'EX', glyph: 'square' },
      { label: 'REST APIs', mark: 'API', glyph: 'square' },
      { label: 'WebSocket', mark: 'WS', glyph: 'square' },
      { label: 'JWT', mark: 'JWT', glyph: 'square' },
      { label: 'Google OAuth 2.0', mark: 'G', glyph: 'square' },
      { label: 'bcrypt', mark: 'BC', glyph: 'square' },
    ],
  },
  {
    category: 'Databases & ORM',
    Icon: Database,
    skills: [
      { label: 'PostgreSQL', mark: 'PG', glyph: 'square' },
      { label: 'MongoDB', mark: 'MDB', glyph: 'mongodb' },
      { label: 'MySQL', mark: 'MY', glyph: 'square' },
      { label: 'Prisma ORM', mark: 'PR', glyph: 'square' },
      { label: 'Drizzle', mark: 'DR', glyph: 'square' },
      { label: 'Cloudinary', mark: 'CL', glyph: 'square' },
    ],
  },
  {
    category: 'AI / GenAI',
    Icon: BrainCircuit,
    skills: [
      { label: 'RAG Pipelines', mark: 'RAG', glyph: 'square' },
      { label: 'OpenRouter', mark: 'OR', glyph: 'square' },
      { label: 'Gemini', mark: 'GM', glyph: 'square' },
      { label: 'OpenAI', mark: 'AI', glyph: 'square' },
      { label: 'Prompt Engineering', mark: 'PE', glyph: 'square' },
    ],
  },
  {
    category: 'Tools & DevOps',
    Icon: Wrench,
    skills: [
      { label: 'Git', mark: 'GIT', glyph: 'git' },
      { label: 'GitHub', mark: 'GH', glyph: 'git' },
      { label: 'Docker', mark: 'DK', glyph: 'docker' },
      { label: 'Vercel', mark: 'VC', glyph: 'vercel' },
      { label: 'Postman', mark: 'PM', glyph: 'square' },
      { label: 'CI/CD', mark: 'CI', glyph: 'square' },
      { label: 'npm', mark: 'NPM', glyph: 'square' },
    ],
  },
]

export const SKILL_ORBIT = [
  { label: 'Build', Icon: Terminal },
  { label: 'Scale', Icon: Cloud },
  { label: 'Ship', Icon: Rocket },
  { label: 'Polish', Icon: Layers3 },
]
