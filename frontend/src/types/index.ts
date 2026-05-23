export interface Blog {
  _id: string
  title: string
  slug: string
  content: string
  tags: string[]
  category: string
  readTime: number
  publishedAt: string
  coverImage: string
  featured: boolean
}

export interface Project {
  _id: string
  title: string
  desc: string
  tags: string[]
  techStack: string[]
  liveUrl: string
  githubUrl: string
  coverImage: string
  featured: boolean
  order: number
}
