import { GraduationCap, GitPullRequest, Medal, Rocket, Trophy } from 'lucide-react'

export const EXPERIENCE_ITEMS = [
  {
    date: "2023-2027",
    title: "B.Tech CSE",
    detail: "Gandhi Engineering College | CGPA 8.9",
    tags: ["Computer Science", "Bhubaneswar"],
    present: true,
    Icon: GraduationCap,
  },
  {
    date: "2025",
    title: "Smart India Hackathon 2025",
    detail: "1st Place | College Level | Team Lead of 6 members",
    tags: ["Leadership", "Product", "Problem Solving"],
    present: false,
    Icon: Trophy,
  },
  {
    date: "Top 4% Globally",
    title: "Knight at LeetCode",
    detail: "700+ problems solved with a focus on C++ and algorithms",
    tags: ["C++", "DSA", "Competitive Programming"],
    present: true,
    Icon: Medal,
  },
  {
    date: "2024-Present",
    title: "Zephyr - AI Website Builder",
    detail: "Personal project for prompt-driven web generation workflows",
    tags: ["AI", "React", "Node.js"],
    present: true,
    Icon: Rocket,
  },
  {
    date: "Open Source",
    title: "Open Source Contributions",
    detail: "Exploring Open Source Projects and GSoC & LFX applicant",
    tags: ["Community", "Mentorship", "GSoC"],
    present: false,
    Icon: GitPullRequest,
  },
];
