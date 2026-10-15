import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)
vi.mock('next/headers', () => ({ cookies: async () => ({ get: vi.fn() }) }))

const TOKEN = 'header.eyJzdWIiOiIxIn0.sig'

beforeEach(() => {
  vi.resetModules()
  mockFetch.mockReset()
})

function answer(body: unknown) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: async () => body })
}

describe('item state client', () => {
  it('reads the state without caching it', async () => {
    answer({ read: ['rss:1'], saved: [] })
    const { getItemState } = await import('@/lib/api-client')

    expect(await getItemState('u1', TOKEN)).toEqual({ read: ['rss:1'], saved: [] })

    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain('/ui/users/u1/state')
    expect(init.cache).toBe('no-store')
  })

  it('marks items read', async () => {
    answer({ success: true })
    const { markItemsRead } = await import('@/lib/api-client')
    await markItemsRead('u1', [1, 2], TOKEN)

    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain('/ui/users/u1/items/read')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ ids: [1, 2] })
  })

  it('saves an item', async () => {
    answer({ success: true })
    const { setItemSaved } = await import('@/lib/api-client')
    await setItemSaved('u1', 5, true, TOKEN)

    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain('/ui/users/u1/items/5/saved')
    expect(init.method).toBe('PUT')
    expect(JSON.parse(init.body)).toEqual({ saved: true })
  })

  it('lists the saved items', async () => {
    answer({ items: [{ id: 5, provider: 'rss' }] })
    const { listSavedItems } = await import('@/lib/api-client')
    expect(await listSavedItems('u1', TOKEN)).toEqual([{ id: 5, provider: 'rss' }])
    expect(mockFetch.mock.calls[0][0]).toContain('/ui/users/u1/saved')
  })

  it('searches with the query encoded', async () => {
    answer({ items: [] })
    const { searchItems } = await import('@/lib/api-client')
    await searchItems('u1', 'a&b c', TOKEN)
    expect(mockFetch.mock.calls[0][0]).toContain('/ui/users/u1/search?q=a%26b%20c')
  })

  it('sets a folder, or clears it with null', async () => {
    answer({ success: true })
    answer({ success: true })
    const { setRepositoryFolder } = await import('@/lib/api-client')
    await setRepositoryFolder('u1', 'l1', 'AI', TOKEN)
    await setRepositoryFolder('u1', 'l1', null, TOKEN)

    expect(mockFetch.mock.calls[0][0]).toContain('/ui/users/u1/repositories/l1')
    expect(mockFetch.mock.calls[0][1].method).toBe('PATCH')
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual({ folder: 'AI' })
    expect(JSON.parse(mockFetch.mock.calls[1][1].body)).toEqual({ folder: null })
  })
})
