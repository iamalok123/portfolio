import { GraduationCap, GitPullRequest, Medal, Rocket, Trophy } from 'lucide-react'

export const EXPERIENCE_ITEMS = [
  {
    date: '2025',
    title: 'Smart India Hackathon 2025',
    detail: '1st Place | National Level | Team Lead of 6 members',
    tags: ['Leadership', 'Product', 'Problem Solving'],
    present: false,
    Icon: Trophy,
  },
  {
    date: '2023-2027',
    title: 'B.Tech CSE',
    detail: 'Gandhi Engineering College | CGPA 8.9',
    tags: ['Computer Science', 'Bhubaneswar'],
    present: true,
    Icon: GraduationCap,
  },
  {
    date: 'Top 5%',
    title: 'LeetCode Knight',
    detail: '600+ problems solved with a focus on C++ and algorithms',
    tags: ['C++', 'DSA', 'Competitive Programming'],
    present: true,
    Icon: Medal,
  },
  {
    date: '2024-Present',
    title: 'Zephyr - AI Website Builder',
    detail: 'Personal project for prompt-driven web generation workflows',
    tags: ['AI', 'React', 'Node.js'],
    present: true,
    Icon: Rocket,
  },
  {
    date: 'Open Source',
    title: 'Open Source Contributions',
    detail: 'GSoC applicant and LFX Mentorship applicant',
    tags: ['Community', 'Mentorship', 'OSS'],
    present: false,
    Icon: GitPullRequest,
  },
]
