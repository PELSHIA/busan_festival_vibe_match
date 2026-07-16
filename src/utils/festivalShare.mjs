const DEFAULT_TITLE = '부산 축제 바이브 매칭'
const DEFAULT_DESCRIPTION = '내 취향에 맞는 부산 축제를 추천받고, 방문 계획과 후기를 남겨보세요.'
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200'

const sanitizeText = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback
  return value.trim() || fallback
}

export const buildFestivalShareUrl = (festival, baseUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:5173') => {
  const url = new URL(baseUrl)
  if (festival?.contentid) {
    url.searchParams.set('festival', festival.contentid)
  }
  return url.toString()
}

export const getFestivalShareMeta = (festival, baseUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:5173') => {
  const title = sanitizeText(festival?.title, DEFAULT_TITLE)
  const description = sanitizeText(festival?.comment, DEFAULT_DESCRIPTION)
  const image = sanitizeText(festival?.firstimage, DEFAULT_IMAGE)
  const url = buildFestivalShareUrl(festival, baseUrl)

  return {
    title,
    description,
    image,
    url
  }
}

export const applyFestivalShareMeta = (festival, baseUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:5173') => {
  if (typeof document === 'undefined') return

  const meta = getFestivalShareMeta(festival, baseUrl)

  const setMeta = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`)
    if (!tag) {
      tag = document.createElement('meta')
      if (property.startsWith('og:')) {
        tag.setAttribute('property', property)
      } else {
        tag.setAttribute('name', property)
      }
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', content)
  }

  setMeta('title', meta.title)
  setMeta('description', meta.description)
  setMeta('og:title', meta.title)
  setMeta('og:description', meta.description)
  setMeta('og:image', meta.image)
  setMeta('og:url', meta.url)
  setMeta('twitter:title', meta.title)
  setMeta('twitter:description', meta.description)
  setMeta('twitter:image', meta.image)
  document.title = `${meta.title} | 부산 축제 바이브 매칭`
}
