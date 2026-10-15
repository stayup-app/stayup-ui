import { describe, it, expect, vi, beforeEach } from 'vitest'

const getToken = vi.fn()
vi.mock('@/lib/session', async () => {
  const actual = await vi.importActual<typeof import('@/lib/session')>('@/lib/session')
  return { ...actual, getToken: () => getToken() }
})

const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`)
})
vi.mock('next/navigation', () => ({ redirect: (url: string) => redirect(url) }))

const getCachedUserFeed = vi.fn()
vi.mock('@/lib/feed-cache', () => ({
  getCachedUserFeed: (...a: unknown[]) => getCachedUserFeed(...a),
}))

class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}
vi.mock('@/lib/api-client', () => ({ ApiError }))

function makeToken(exp: number) {
  const body = Buffer.from(JSON.stringify({ sub: 'u1', name: 'Ada', exp })).toString('base64url')
  return `h.${body}.s`
}
const LIVE = makeToken(Math.floor(Date.now() / 1000) + 3600)

beforeEach(() => {
  vi.clearAllMocks()
  getToken.mockResolvedValue(LIVE)
  getCachedUserFeed.mockResolvedValue({
    repositories: [
      { id: 'l1', repository_id: 1, url: 'https://a.dev', provider: 'rss', config: {} },
    ],
    connectors: { rss: [] },
  })
})

describe('loadFeed', () => {
  it('returns the feed with the bundled provider templates', async () => {
    const { loadFeed } = await import('@/lib/feed')
    const feed = await loadFeed()
    expect(feed.userId).toBe('u1')
    expect(getCachedUserFeed).toHaveBeenCalledWith('u1', LIVE)
    expect(Object.keys(feed.templates).sort()).toEqual([
      'changelog',
      'github_trending',
      'podcast',
      'reddit',
      'rss',
      'scrap',
      'social',
      'youtube',
    ])
  })

  it('sends a visitor without a session to the login page', async () => {
    getToken.mockResolvedValue(null)
    const { loadFeed } = await import('@/lib/feed')
    await expect(loadFeed()).rejects.toThrow('NEXT_REDIRECT:/login')
  })

  it('sends a visitor with an expired token to the login page', async () => {
    getToken.mockResolvedValue(makeToken(Math.floor(Date.now() / 1000) - 60))
    const { loadFeed } = await import('@/lib/feed')
    await expect(loadFeed()).rejects.toThrow('NEXT_REDIRECT:/login')
  })

  it('sends a visitor whose token the API rejects to the login page', async () => {
    getCachedUserFeed.mockRejectedValue(new ApiError(401, 'Unauthorized'))
    const { loadFeed } = await import('@/lib/feed')
    await expect(loadFeed()).rejects.toThrow('NEXT_REDIRECT:/login')
  })

  it('lets other failures reach the error boundary', async () => {
    getCachedUserFeed.mockRejectedValue(new ApiError(500, 'boom'))
    const { loadFeed } = await import('@/lib/feed')
    await expect(loadFeed()).rejects.toThrow('boom')
  })
})

describe('toFeedRepositories', () => {
  it('keeps what the views need from each repository', async () => {
    const { toFeedRepositories } = await import('@/lib/feed')
    expect(
      toFeedRepositories([
        {
          id: 'l1',
          repository_id: 1,
          created_at: 'x',
          url: 'https://a.dev',
          provider: 'rss',
          config: {},
        },
      ]),
    ).toEqual([{ repository_id: 1, url: 'https://a.dev', provider: 'rss', config: {} }])
  })
})
