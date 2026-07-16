import { describe, it } from 'vitest'
import { expect } from 'vitest'
import { buildFestivalShareUrl, getFestivalShareMeta } from './festivalShare.mjs'

describe('festival share helpers', () => {
  it('builds a share url with festival content id', () => {
    const festival = { contentid: '1234' }
    const shareUrl = buildFestivalShareUrl(festival, 'https://example.com/result')

    expect(shareUrl).toContain('festival=1234')
  })

  it('returns fallback metadata when festival info is missing', () => {
    const meta = getFestivalShareMeta(null, 'https://example.com/result')

    expect(meta.title).toBe('부산 축제 바이브 매칭')
    expect(meta.description).toContain('부산 축제')
  })
})
