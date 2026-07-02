export interface Blog {
  _id: string
  title: string
  slug: string
  content: string
  tags: string[]
  readTime: number
  publishedAt: string
  image?: string
  coverImage?: string
  views?: number
}

export interface Project {
  _id: string
  title: string
  desc: string
  techStack: string[]
  liveUrl: string
  githubUrl: string
  image?: string
  coverImage?: string
  order: number
}
