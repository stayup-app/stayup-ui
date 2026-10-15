import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeedClientView } from '@/components/feed/FeedClientView'
import { FeedContentViewer } from '@/components/feed/FeedContentViewer'
import { FeedSidebar } from '@/components/feed/FeedSidebar'
import { RepositoriesTable } from '@/components/admin/RepositoriesTable'
import { ReadProvider, useReadContext } from '@/context/FeedReadContext'
import { LanguageProvider } from '@/context/LanguageContext'
import type { AdminRepository } from '@/lib/api-client'
import type { TaggedItem, UserRepository } from '@/types'
import { TEMPLATES } from './_templates'

const refresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
  usePathname: () => '/feed',
}))
vi.mock('@/lib/admin-actions', () => ({
  adminDeleteRepositoryAction: vi.fn(),
  adminClearRepositoryDataAction: vi.fn(),
  adminListRepositorySubscribersAction: vi.fn(),
}))

const LS_KEY = 'STAYUP_READ_ITEMS'

/** Routes the calls the app makes to canned answers; records every call. */
const calls: { url: string; init?: RequestInit }[] = []
let server: { read: string[]; saved: string[]; saved_rows: unknown[]; search_rows: unknown[] }

function fakeFetch(url: string, init?: RequestInit) {
  calls.push({ url, init })
  const ok = (body: unknown) => Promise.resolve({ ok: true, json: async () => body })
  if (url === '/api/state') return ok({ read: server.read, saved: server.saved })
  if (url === '/api/saved') return ok({ items: server.saved_rows })
  if (url.startsWith('/api/search')) return ok({ items: server.search_rows })
  return ok({ success: true })
}

function row(id: number, extra: Record<string, unknown> = {}) {
  return {
    id,
    provider: 'changelog',
    repository_id: 1,
    content: `release ${id}`,
    datetime: `2026-03-0${id}T10:00:00Z`,
    executed_at: `2026-03-0${id}T11:00:00Z`,
    success: true,
    version: `v${id}.0.0`,
    ...extra,
  }
}

function tagged(id: number): TaggedItem {
  return { provider: 'changelog', item: row(id) } as TaggedItem
}

const REPOS = [{ repository_id: 1, url: 'https://github.com/facebook/react' }]

function withApp(ui: React.ReactNode) {
  return render(
    <LanguageProvider initialLang="en">
      <ReadProvider>{ui}</ReadProvider>
    </LanguageProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  calls.length = 0
  server = { read: [], saved: [], saved_rows: [], search_rows: [] }
  vi.stubGlobal('fetch', vi.fn(fakeFetch))
})

function Probe() {
  const { readIds, savedIds, markRead, markAllRead, toggleSaved } = useReadContext()
  return (
    <div>
      <span data-testid="read">{[...readIds].sort().join(',')}</span>
      <span data-testid="saved">{[...savedIds].sort().join(',')}</span>
      <button onClick={() => markRead(tagged(1))}>read one</button>
      <button onClick={() => markAllRead([tagged(2), tagged(3)])}>read all</button>
      <button onClick={() => toggleSaved(tagged(4))}>toggle</button>
    </div>
  )
}

describe('read state sync', () => {
  it("adopts the server's read and saved items", async () => {
    server.read = ['changelog:7']
    server.saved = ['changelog:9']
    withApp(<Probe />)

    await waitFor(() => expect(screen.getByTestId('read')).toHaveTextContent('changelog:7'))
    expect(screen.getByTestId('saved')).toHaveTextContent('changelog:9')
  })

  it('uploads what only this device had read, once, and keeps both', async () => {
    localStorage.setItem(LS_KEY, JSON.stringify(['changelog:1', 'changelog:7']))
    server.read = ['changelog:7']
    withApp(<Probe />)

    await waitFor(() => expect(calls.some((c) => c.url === '/api/state/read')).toBe(true))
    const upload = calls.find((c) => c.url === '/api/state/read')
    expect(JSON.parse(upload?.init?.body as string)).toEqual({ ids: [1] })
    expect(screen.getByTestId('read')).toHaveTextContent('changelog:1,changelog:7')
  })

  it('tells the server when an item is read', async () => {
    const user = userEvent.setup()
    withApp(<Probe />)
    await waitFor(() => expect(calls.some((c) => c.url === '/api/state')).toBe(true))

    await user.click(screen.getByText('read one'))

    await waitFor(() => {
      const sent = calls.filter((c) => c.url === '/api/state/read')
      expect(sent.map((c) => JSON.parse(c.init?.body as string))).toEqual([{ ids: [1] }])
    })
  })

  it('only sends the items that were not read yet when marking all', async () => {
    const user = userEvent.setup()
    withApp(<Probe />)
    await user.click(screen.getByText('read one'))
    await user.click(screen.getByText('read all'))

    await waitFor(() =>
      expect(screen.getByTestId('read')).toHaveTextContent('changelog:1,changelog:2,changelog:3'),
    )
    const bodies = calls
      .filter((c) => c.url === '/api/state/read')
      .map((c) => JSON.parse(c.init?.body as string).ids)
    expect(bodies).toContainEqual([2, 3])
  })

  it('keeps working when the server is unreachable', async () => {
    localStorage.setItem(LS_KEY, JSON.stringify(['changelog:5']))
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('offline'))),
    )
    withApp(<Probe />)

    await waitFor(() => expect(screen.getByTestId('read')).toHaveTextContent('changelog:5'))
  })

  it('ignores an answer that is not the expected shape', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ repos: [] }) })),
    )
    withApp(<Probe />)
    await new Promise((r) => setTimeout(r, 20))
    expect(screen.getByTestId('read')).toHaveTextContent('')
  })

  it('saves and unsaves an item through the API', async () => {
    const user = userEvent.setup()
    withApp(<Probe />)

    await user.click(screen.getByText('toggle'))
    expect(screen.getByTestId('saved')).toHaveTextContent('changelog:4')
    await user.click(screen.getByText('toggle'))
    expect(screen.getByTestId('saved')).toHaveTextContent('')

    const puts = calls.filter((c) => c.url === '/api/items/4/saved')
    expect(puts.map((c) => JSON.parse(c.init?.body as string).saved).filter(Boolean)).toContain(
      true,
    )
    expect(puts.some((c) => JSON.parse(c.init?.body as string).saved === false)).toBe(true)
  })
})

describe('saved tab and search', () => {
  it('lists the saved items from the API under the Saved filter', async () => {
    server.saved_rows = [row(3)]
    const user = userEvent.setup()
    withApp(<FeedClientView items={[tagged(1)]} repositories={REPOS} templates={TEMPLATES} />)

    await user.click(screen.getByRole('button', { name: 'Saved' }))

    expect(await screen.findByText('v3.0.0')).toBeInTheDocument()
    expect(screen.queryByText('v1.0.0')).not.toBeInTheDocument()
  })

  it('searches after a pause, then goes back to the feed when cleared', async () => {
    server.search_rows = [row(2)]
    const user = userEvent.setup()
    withApp(<FeedClientView items={[tagged(1)]} repositories={REPOS} templates={TEMPLATES} />)

    await user.type(screen.getByPlaceholderText('Search…'), 'rel')
    expect(await screen.findByText('v2.0.0')).toBeInTheDocument()
    expect(screen.queryByText('v1.0.0')).not.toBeInTheDocument()
    expect(calls.some((c) => c.url === '/api/search?q=rel')).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(await screen.findByText('v1.0.0')).toBeInTheDocument()
  })

  it('does not search for a single character', async () => {
    const user = userEvent.setup()
    withApp(<FeedClientView items={[tagged(1)]} repositories={REPOS} templates={TEMPLATES} />)

    await user.type(screen.getByPlaceholderText('Search…'), 'r')
    await new Promise((r) => setTimeout(r, 400))

    expect(calls.some((c) => c.url.startsWith('/api/search'))).toBe(false)
    expect(screen.getByText('v1.0.0')).toBeInTheDocument()
  })

  it('shows an empty list when the search request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        url.startsWith('/api/search') ? Promise.reject(new Error('boom')) : fakeFetch(url),
      ),
    )
    const user = userEvent.setup()
    withApp(<FeedClientView items={[tagged(1)]} repositories={REPOS} templates={TEMPLATES} />)

    await user.type(screen.getByPlaceholderText('Search…'), 'rel')

    expect(await screen.findByText('No content available.')).toBeInTheDocument()
  })
})

describe('save button in the viewer', () => {
  it('toggles the saved state of the open item', async () => {
    const user = userEvent.setup()
    withApp(<FeedContentViewer item={tagged(1)} repositories={REPOS} templates={TEMPLATES} />)

    await user.click(screen.getByRole('button', { name: 'Save for later' }))

    expect(await screen.findByRole('button', { name: 'Remove from saved' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(calls.some((c) => c.url === '/api/items/1/saved')).toBe(true)
  })

  it('has no save button when nothing is open', () => {
    withApp(<FeedContentViewer item={null} repositories={REPOS} templates={TEMPLATES} />)
    expect(screen.queryByRole('button', { name: 'Save for later' })).not.toBeInTheDocument()
  })
})

function flux(overrides: Partial<UserRepository> = {}): UserRepository {
  return {
    id: 'l1',
    userId: 'u1',
    repositoryId: 1,
    provider: 'changelog',
    url: 'https://github.com/facebook/react/',
    identifier: 'facebook/react',
    config: {},
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('folders in the sidebar', () => {
  function sidebar(fluxes: UserRepository[]) {
    return render(
      <LanguageProvider initialLang="en">
        <FeedSidebar fluxes={fluxes} templates={TEMPLATES} unreadCountByRepoId={{ 1: 3 }} />
      </LanguageProvider>,
    )
  }

  it('shows a folder with its flux, and leaves the others under their provider', () => {
    sidebar([
      flux({ folder: 'AI' }),
      flux({ id: 'l2', repositoryId: 2, identifier: 'vercel/next.js' }),
    ])

    const link = screen.getByRole('link', { name: /AI/ })
    expect(link).toHaveAttribute('href', '/feed/folder/AI')
    expect(within(link).getByText('3')).toBeInTheDocument()
    expect(screen.getByText('facebook/react')).toBeInTheDocument()
    expect(screen.getByText('vercel/next.js')).toBeInTheDocument()
  })

  it('encodes the folder name in the link', () => {
    sidebar([flux({ folder: 'R&D / 2026' })])
    expect(screen.getByRole('link', { name: /R&D/ })).toHaveAttribute(
      'href',
      '/feed/folder/R%26D%20%2F%202026',
    )
  })

  it('moves a flux into a folder', async () => {
    vi.stubGlobal(
      'prompt',
      vi.fn(() => ' Security '),
    )
    const user = userEvent.setup()
    sidebar([flux()])

    await user.click(screen.getByRole('button', { name: 'Move to folder' }))

    await waitFor(() => expect(refresh).toHaveBeenCalled())
    const patch = calls.find((c) => c.url === '/api/fluxes/l1')
    expect(patch?.init?.method).toBe('PATCH')
    expect(JSON.parse(patch?.init?.body as string)).toEqual({ folder: 'Security' })
  })

  it('removes the folder when the name is emptied, and does nothing when cancelled', async () => {
    const prompt = vi.fn().mockReturnValueOnce('').mockReturnValueOnce(null)
    vi.stubGlobal('prompt', prompt)
    const user = userEvent.setup()
    sidebar([flux({ folder: 'AI' })])

    await user.click(screen.getByRole('button', { name: 'Move to folder' }))
    await waitFor(() => expect(calls.some((c) => c.url === '/api/fluxes/l1')).toBe(true))
    expect(JSON.parse(calls.find((c) => c.url === '/api/fluxes/l1')?.init?.body as string)).toEqual(
      {
        folder: null,
      },
    )

    calls.length = 0
    await user.click(screen.getByRole('button', { name: 'Move to folder' }))
    expect(calls).toHaveLength(0)
  })
})

describe('flux health in the admin table', () => {
  const REPO: AdminRepository = {
    id: 5,
    url: 'https://example.com/feed',
    type: 'rss',
    config: {},
    subscriber_count: '2',
    last_item_at: '2026-03-05T10:00:00Z',
    failures_since_item: 0,
    last_error: null,
    last_error_at: null,
  }

  function table(repo: AdminRepository) {
    return render(
      <LanguageProvider initialLang="en">
        <RepositoriesTable repositories={[repo]} />
      </LanguageProvider>,
    )
  }

  it('shows a healthy flux as OK', () => {
    table(REPO)
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('shows the failure count, with the last error as a tooltip', () => {
    table({ ...REPO, failures_since_item: 3, last_error: 'HTTP 503' })
    expect(screen.getByText('Failing (3)')).toHaveAttribute('title', 'HTTP 503')
  })

  it('says so when nothing was ever collected', () => {
    table({ ...REPO, last_item_at: null })
    expect(screen.getByText('Nothing collected yet')).toBeInTheDocument()
  })
})
