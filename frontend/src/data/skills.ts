import {
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  Database,
  Layers3,
  MonitorSmartphone,
  Server,
  Terminal,
  Wrench,
} from 'lucide-react'

export const SKILL_GROUPS = [
  {
    category: 'Languages',
    Icon: Code2,
    skills: ['C++', 'JavaScript', 'TypeScript', 'Python'],
  },
  {
    category: 'Frontend',
    Icon: MonitorSmartphone,
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    category: 'Backend',
    Icon: Server,
    skills: ['Node.js', 'Express', 'NestJS'],
  },
  {
    category: 'Databases',
    Icon: Database,
    skills: ['MongoDB', 'PostgreSQL', 'Redis'],
  },
  {
    category: 'Tools & DevOps',
    Icon: Wrench,
    skills: ['Git', 'Docker', 'Nginx', 'AWS EC2', 'Vercel'],
  },
  {
    category: 'AI/ML',
    Icon: BrainCircuit,
    skills: ['LangChain', 'OpenAI API', 'Pinecone', 'Inngest'],
  },
]

export const SKILL_ORBIT = [
  { label: 'Build', Icon: Terminal },
  { label: 'Scale', Icon: Cloud },
  { label: 'Ship', Icon: Cpu },
  { label: 'Polish', Icon: Layers3 },
]
