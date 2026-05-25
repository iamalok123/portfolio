import { api } from './axios'

const apiOrigin = (() => {
  try {
    return new URL(api.defaults.baseURL ?? '', window.location.origin).origin
  } catch {
    return ''
  }
})()

export function resolveAssetUrl(src?: string) {
  if (!src) return ''

  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:') || src.startsWith('blob:')) {
    return src
  }

  if (src.startsWith('/asset/') || src.startsWith('/assets/')) {
    return `${apiOrigin}${src}`
  }

  return src
}
