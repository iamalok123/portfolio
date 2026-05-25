export interface Blog {
  _id: string
  title: string
  slug: string
  content: string
  tags: string[]
  category: string
  readTime: number
  publishedAt: string
  image?: string
  coverImage?: string
}

export interface Project {
  _id: string
  title: string
  desc: string
  tags: string[]
  techStack: string[]
  liveUrl: string
  githubUrl: string
  image?: string
  coverImage?: string
  order: number
}
