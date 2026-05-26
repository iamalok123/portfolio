import type { IconType } from 'react-icons'
import {
  SiC,
  SiCplusplus,
  SiCloudinary,
  SiDocker,
  SiDrizzle,
  SiExpress,
  SiGit,
  SiGithub,
  SiGooglegemini,
  SiJavascript,
  SiJsonwebtokens,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiOpenai,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedux,
  SiSocketdotio,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si'
import {
  TbApi,
  TbBinaryTree2,
  TbBrain,
  TbBrandOauth,
  TbCirclesRelation,
  TbCloud,
  TbCode,
  TbDatabase,
  TbGitBranch,
  TbLayersIntersect,
  TbLockPassword,
  TbPrompt,
  TbRocket,
  TbRoute,
  TbServer,
  TbSql,
  TbTerminal2,
  TbTools,
  TbWebhook,
  TbWindow,
} from 'react-icons/tb'

type SkillItem = {
  label: string
  Icon: IconType
}

type SkillGroup = {
  category: string
  Icon: IconType
  skills: SkillItem[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Languages',
    Icon: TbCode,
    skills: [
      { label: 'C', Icon: SiC },
      { label: 'C++', Icon: SiCplusplus },
      { label: 'Python', Icon: SiPython },
      { label: 'JavaScript', Icon: SiJavascript },
      { label: 'TypeScript', Icon: SiTypescript },
      { label: 'SQL', Icon: TbSql },
    ],
  },
  {
    category: 'Frontend',
    Icon: TbWindow,
    skills: [
      { label: 'React.js', Icon: SiReact },
      { label: 'Next.js', Icon: SiNextdotjs },
      { label: 'Redux Toolkit', Icon: SiRedux },
      { label: 'Zustand', Icon: TbCirclesRelation },
      { label: 'Tailwind CSS', Icon: SiTailwindcss },
      { label: 'Socket.IO', Icon: SiSocketdotio },
    ],
  },
  {
    category: 'Backend',
    Icon: TbServer,
    skills: [
      { label: 'Node.js', Icon: SiNodedotjs },
      { label: 'Express.js', Icon: SiExpress },
      { label: 'REST APIs', Icon: TbApi },
      { label: 'WebSocket', Icon: TbWebhook },
      { label: 'JWT', Icon: SiJsonwebtokens },
      { label: 'Google OAuth 2.0', Icon: TbBrandOauth },
      { label: 'bcrypt', Icon: TbLockPassword },
    ],
  },
  {
    category: 'Databases & ORM',
    Icon: TbDatabase,
    skills: [
      { label: 'PostgreSQL', Icon: SiPostgresql },
      { label: 'MongoDB', Icon: SiMongodb },
      { label: 'MySQL', Icon: SiMysql },
      { label: 'Prisma ORM', Icon: SiPrisma },
      { label: 'Drizzle', Icon: SiDrizzle },
      { label: 'Cloudinary', Icon: SiCloudinary },
    ],
  },
  {
    category: 'AI / GenAI',
    Icon: TbBrain,
    skills: [
      { label: 'RAG Pipelines', Icon: TbBinaryTree2 },
      { label: 'OpenRouter', Icon: TbRoute },
      { label: 'Gemini', Icon: SiGooglegemini },
      { label: 'OpenAI', Icon: SiOpenai },
      { label: 'Prompt Engineering', Icon: TbPrompt },
    ],
  },
  {
    category: 'Tools & DevOps',
    Icon: TbTools,
    skills: [
      { label: 'Git', Icon: SiGit },
      { label: 'GitHub', Icon: SiGithub },
      { label: 'Docker', Icon: SiDocker },
      { label: 'Vercel', Icon: SiVercel },
      { label: 'Postman', Icon: SiPostman },
      { label: 'CI/CD', Icon: TbGitBranch },
      { label: 'npm', Icon: SiNpm },
    ],
  },
]

export const SKILL_ORBIT = [
  { label: 'Build', Icon: TbTerminal2 },
  { label: 'Scale', Icon: TbCloud },
  { label: 'Ship', Icon: TbRocket },
  { label: 'Polish', Icon: TbLayersIntersect },
]
