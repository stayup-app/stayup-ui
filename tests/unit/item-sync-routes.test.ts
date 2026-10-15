import { describe, it, expect, vi, beforeEach } from 'vitest'

const cookieGet = vi.fn()
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: cookieGet, set: vi.fn(), delete: vi.fn() }),
}))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

const api = {
  getItemState: vi.fn(),
  markItemsRead: vi.fn(),
  setItemSaved: vi.fn(),
  listSavedItems: vi.fn(),
  searchItems: vi.fn(),
  setRepositoryFolder: vi.fn(),
  deleteUserRepository: vi.fn(),
}
vi.mock('@/lib/api-client', () => api)

function makeToken() {
  const body = Buffer.from(
    JSON.stringify({ sub: 'u1', exp: Math.floor(Date.now() / 1000) + 3600 }),
  ).toString('base64url')
  return `header.${body}.sig`
}
const TOKEN = makeToken()

function req(body?: unknown, url = 'http://localhost/api/x') {
  return { url, json: async () => body } as Request
}

function signedIn(on = true) {
  cookieGet.mockImplementation((name: string) =>
    on && name === 'stayup_token' ? { value: TOKEN } : undefined,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  signedIn()
})

describe('GET /api/state', () => {
  it('returns the API state for the signed-in user', async () => {
    api.getItemState.mockResolvedValue({ read: ['rss:1'], saved: [] })
    const { GET } = await import('@/app/api/state/route')
    const res = await GET()
    expect(await res.json()).toEqual({ read: ['rss:1'], saved: [] })
    expect(api.getItemState).toHaveBeenCalledWith('u1', TOKEN)
  })

  it('is 401 without a session', async () => {
    signedIn(false)
    const { GET } = await import('@/app/api/state/route')
    expect((await GET()).status).toBe(401)
  })
})

describe('POST /api/state/read', () => {
  it('forwards the ids', async () => {
    const { POST } = await import('@/app/api/state/read/route')
    const res = await POST(req({ ids: [1, 2] }))
    expect(res.status).toBe(200)
    expect(api.markItemsRead).toHaveBeenCalledWith('u1', [1, 2], TOKEN)
  })

  it('rejects ids that are not integers', async () => {
    const { POST } = await import('@/app/api/state/read/route')
    expect((await POST(req({ ids: ['x'] }))).status).toBe(400)
    expect((await POST(req({}))).status).toBe(400)
    expect(api.markItemsRead).not.toHaveBeenCalled()
  })

  it('is 401 without a session', async () => {
    signedIn(false)
    const { POST } = await import('@/app/api/state/read/route')
    expect((await POST(req({ ids: [1] }))).status).toBe(401)
  })
})

describe('PUT /api/items/[id]/saved', () => {
  const params = (id: string) => ({ params: Promise.resolve({ id }) })

  it('saves the item', async () => {
    const { PUT } = await import('@/app/api/items/[id]/saved/route')
    const res = await PUT(req({ saved: true }), params('5'))
    expect(res.status).toBe(200)
    expect(api.setItemSaved).toHaveBeenCalledWith('u1', 5, true, TOKEN)
  })

  it('rejects a bad id or a non-boolean', async () => {
    const { PUT } = await import('@/app/api/items/[id]/saved/route')
    expect((await PUT(req({ saved: true }), params('abc'))).status).toBe(400)
    expect((await PUT(req({ saved: 'yes' }), params('5'))).status).toBe(400)
  })

  it('is 401 without a session', async () => {
    signedIn(false)
    const { PUT } = await import('@/app/api/items/[id]/saved/route')
    expect((await PUT(req({ saved: true }), params('5'))).status).toBe(401)
  })
})

describe('GET /api/saved', () => {
  it('returns the saved items', async () => {
    api.listSavedItems.mockResolvedValue([{ id: 1 }])
    const { GET } = await import('@/app/api/saved/route')
    expect(await (await GET()).json()).toEqual({ items: [{ id: 1 }] })
  })

  it('is 401 without a session', async () => {
    signedIn(false)
    const { GET } = await import('@/app/api/saved/route')
    expect((await GET()).status).toBe(401)
  })
})

describe('GET /api/search', () => {
  it('searches with the trimmed query', async () => {
    api.searchItems.mockResolvedValue([{ id: 1 }])
    const { GET } = await import('@/app/api/search/route')
    const res = await GET(req(undefined, 'http://localhost/api/search?q=%20react%20'))
    expect(await res.json()).toEqual({ items: [{ id: 1 }] })
    expect(api.searchItems).toHaveBeenCalledWith('u1', 'react', TOKEN)
  })

  it('answers an empty list without calling the API for a short query', async () => {
    const { GET } = await import('@/app/api/search/route')
    expect(await (await GET(req(undefined, 'http://localhost/api/search?q=a'))).json()).toEqual({
      items: [],
    })
    expect(await (await GET(req(undefined, 'http://localhost/api/search'))).json()).toEqual({
      items: [],
    })
    expect(api.searchItems).not.toHaveBeenCalled()
  })

  it('is 401 without a session', async () => {
    signedIn(false)
    const { GET } = await import('@/app/api/search/route')
    expect((await GET(req(undefined, 'http://localhost/api/search?q=abc'))).status).toBe(401)
  })
})

describe('PATCH /api/fluxes/[id]', () => {
  const params = Promise.resolve({ id: 'link1' })

  it('sets the folder', async () => {
    const { PATCH } = await import('@/app/api/fluxes/[id]/route')
    expect((await PATCH(req({ folder: 'AI' }), { params })).status).toBe(200)
    expect(api.setRepositoryFolder).toHaveBeenCalledWith('u1', 'link1', 'AI', TOKEN)
  })

  it('clears it with null', async () => {
    const { PATCH } = await import('@/app/api/fluxes/[id]/route')
    await PATCH(req({ folder: null }), { params })
    expect(api.setRepositoryFolder).toHaveBeenCalledWith('u1', 'link1', null, TOKEN)
  })

  it('rejects anything else', async () => {
    const { PATCH } = await import('@/app/api/fluxes/[id]/route')
    expect((await PATCH(req({ folder: 3 }), { params })).status).toBe(400)
    expect((await PATCH(req({}), { params })).status).toBe(400)
  })

  it('is 401 without a session', async () => {
    signedIn(false)
    const { PATCH } = await import('@/app/api/fluxes/[id]/route')
    expect((await PATCH(req({ folder: 'AI' }), { params })).status).toBe(401)
  })
})
