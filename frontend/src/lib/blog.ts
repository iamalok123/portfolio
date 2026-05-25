import type { Blog } from '../types'

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function getBlogExcerpt(blog: Blog, limit = 112) {
  const source = blog.content || blog.title
  const cleaned = source
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#\s+.+$/gm, '')
    .replace(/[#>*_`[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned.length > limit ? `${cleaned.slice(0, limit).trim()}...` : cleaned
}

export function extractToc(content: string): TocItem[] {
  return Array.from(content.matchAll(/^(#{2,3})\s+(.+)$/gm)).map((match) => ({
    id: slugify(match[2]),
    text: match[2],
    level: match[1].length as 2 | 3,
  }))
}
