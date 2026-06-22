import { useEffect } from 'react'

interface SEOOptions {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  /** ISO date string for article published date */
  articlePublishedTime?: string
  /** Article section / category */
  articleSection?: string
  /** Article tags */
  articleTags?: string[]
  noIndex?: boolean
}

const SITE_NAME = 'alokhotta.site'
const BASE_URL = 'https://www.alokhotta.site'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`
const TWITTER_HANDLE = '@_alok_h'

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function removeMetaIfExists(name: string, attr: 'name' | 'property' = 'property') {
  const el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (el) el.remove()
}

/**
 * useSEO — dynamically updates the document <head> for per-page SEO.
 *
 * Call this hook at the top of every page component. It sets:
 *  - <title>
 *  - meta description, robots, canonical
 *  - Open Graph tags (title, description, image, type, url, site_name)
 *  - Twitter Card tags
 *  - Article-specific tags when ogType === 'article'
 */
export function useSEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  articlePublishedTime,
  articleSection,
  articleTags,
  noIndex = false,
}: SEOOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${window.location.pathname}`

    // ── <title> ──────────────────────────────────────────────────
    document.title = fullTitle

    // ── Primary meta ─────────────────────────────────────────────
    setMeta('description', description)
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')

    // ── Canonical ─────────────────────────────────────────────────
    setLink('canonical', canonicalUrl)

    // ── Open Graph ────────────────────────────────────────────────
    setMeta('og:type', ogType, 'property')
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', canonicalUrl, 'property')
    setMeta('og:image', ogImage, 'property')
    setMeta('og:image:alt', `${title} – Alok Hotta Portfolio`, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')
    setMeta('og:locale', 'en_US', 'property')

    // ── Twitter Card ─────────────────────────────────────────────
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)
    setMeta('twitter:image:alt', `${title} – Alok Hotta Portfolio`)
    setMeta('twitter:site', TWITTER_HANDLE)
    setMeta('twitter:creator', TWITTER_HANDLE)

    // ── Article-specific meta ─────────────────────────────────────
    if (ogType === 'article') {
      if (articlePublishedTime) {
        setMeta('article:published_time', articlePublishedTime, 'property')
      }
      if (articleSection) {
        setMeta('article:section', articleSection, 'property')
      }
      if (articleTags?.length) {
        // Remove old article:tag metas, then add fresh ones
        document.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove())
        articleTags.forEach((tag) => {
          const el = document.createElement('meta')
          el.setAttribute('property', 'article:tag')
          el.setAttribute('content', tag)
          document.head.appendChild(el)
        })
      }
    } else {
      // Clean up article-only tags if we're not on an article page
      removeMetaIfExists('article:published_time')
      removeMetaIfExists('article:section')
      document.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove())
    }
  }, [title, description, canonical, ogImage, ogType, articlePublishedTime, articleSection, articleTags, noIndex])
}
