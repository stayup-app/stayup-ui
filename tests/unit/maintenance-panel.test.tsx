import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MaintenancePanel } from '@/components/admin/MaintenancePanel'
import { LanguageProvider } from '@/context/LanguageContext'
import type { RetentionSettings } from '@/lib/api-client'

const refresh = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }))

const actions = vi.hoisted(() => ({
  adminUpdateRetentionAction: vi.fn(),
  adminRunCleanupAction: vi.fn(),
}))
vi.mock('@/lib/admin-actions', () => actions)

function withLang(ui: React.ReactElement) {
  return render(<LanguageProvider initialLang="en">{ui}</LanguageProvider>)
}

const SETTINGS: RetentionSettings = {
  default: 30,
  providers: [
    { name: 'rss', displayName: 'RSS', retention_days: null },
    { name: 'youtube', displayName: 'YouTube', retention_days: 7 },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()
  actions.adminUpdateRetentionAction.mockResolvedValue({})
  actions.adminRunCleanupAction.mockResolvedValue({ total: 0, purged: [] })
})

describe('MaintenancePanel', () => {
  it('shows a load error when settings are missing', () => {
    withLang(<MaintenancePanel settings={null} />)
    expect(
      screen.getByText('Could not load the retention settings. Is the API reachable?'),
    ).toBeInTheDocument()
  })

  it('prefills the global default and each provider override', () => {
    withLang(<MaintenancePanel settings={SETTINGS} />)
    expect(screen.getByLabelText('Retention (days)')).toHaveValue(30)
    expect(screen.getByLabelText('RSS')).toHaveValue(null)
    expect(screen.getByLabelText('YouTube')).toHaveValue(7)
  })

  it('saves the global default and provider overrides', async () => {
    const user = userEvent.setup()
    withLang(<MaintenancePanel settings={SETTINGS} />)

    const global = screen.getByLabelText('Retention (days)')
    await user.clear(global)
    await user.type(global, '45')

    const rss = screen.getByLabelText('RSS')
    await user.type(rss, '10')

    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() =>
      expect(actions.adminUpdateRetentionAction).toHaveBeenCalledWith({
        default: 45,
        providers: { rss: 10, youtube: 7 },
      }),
    )
    expect(await screen.findByText('Saved.')).toBeInTheDocument()
  })

  it('sends a null default when the global purge is disabled', async () => {
    const user = userEvent.setup()
    withLang(<MaintenancePanel settings={SETTINGS} />)

    await user.click(screen.getByLabelText('Disable the global purge'))
    expect(screen.getByLabelText('Retention (days)')).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() =>
      expect(actions.adminUpdateRetentionAction).toHaveBeenCalledWith({
        default: null,
        providers: { rss: null, youtube: 7 },
      }),
    )
  })

  it('rejects a fractional day count without calling the action', async () => {
    const user = userEvent.setup()
    withLang(<MaintenancePanel settings={SETTINGS} />)

    const global = screen.getByLabelText('Retention (days)')
    await user.clear(global)
    await user.type(global, '2.5')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(
      await screen.findByText('Enter a whole number of days ≥ 1, or leave empty.'),
    ).toBeInTheDocument()
    expect(actions.adminUpdateRetentionAction).not.toHaveBeenCalled()
  })

  it('runs a manual cleanup and reports the count', async () => {
    actions.adminRunCleanupAction.mockResolvedValue({
      total: 12,
      purged: [{ provider: 'rss', deleted: 12 }],
    })
    const user = userEvent.setup()
    withLang(<MaintenancePanel settings={SETTINGS} />)

    await user.click(screen.getByRole('button', { name: 'Run cleanup' }))

    await waitFor(() => expect(actions.adminRunCleanupAction).toHaveBeenCalled())
    expect(await screen.findByText('12 item(s) removed.')).toBeInTheDocument()
  })

  it('reports an empty cleanup run', async () => {
    const user = userEvent.setup()
    withLang(<MaintenancePanel settings={SETTINGS} />)

    await user.click(screen.getByRole('button', { name: 'Run cleanup' }))

    expect(await screen.findByText('Nothing to remove.')).toBeInTheDocument()
  })
})
