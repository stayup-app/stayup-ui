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

  it('treats a missing total as nothing removed', async () => {
    actions.adminRunCleanupAction.mockResolvedValue({})
    const user = userEvent.setup()
    withLang(<MaintenancePanel settings={SETTINGS} />)

    await user.click(screen.getByRole('button', { name: 'Run cleanup' }))

    expect(await screen.findByText('Nothing to remove.')).toBeInTheDocument()
    expect(refresh).toHaveBeenCalled()
  })

  it('shows the error when the cleanup fails', async () => {
    actions.adminRunCleanupAction.mockResolvedValue({ error: 'cleanup failed' })
    const user = userEvent.setup()
    withLang(<MaintenancePanel settings={SETTINGS} />)

    await user.click(screen.getByRole('button', { name: 'Run cleanup' }))

    expect(await screen.findByText('cleanup failed')).toBeInTheDocument()
    expect(refresh).not.toHaveBeenCalled()
  })

  it('rejects an empty global default while the purge is enabled', async () => {
    const user = userEvent.setup()
    withLang(<MaintenancePanel settings={SETTINGS} />)

    await user.clear(screen.getByLabelText('Retention (days)'))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(
      await screen.findByText('Enter a whole number of days ≥ 1, or leave empty.'),
    ).toBeInTheDocument()
    expect(actions.adminUpdateRetentionAction).not.toHaveBeenCalled()
  })

  it('rejects an invalid provider override', async () => {
    const user = userEvent.setup()
    withLang(<MaintenancePanel settings={SETTINGS} />)

    await user.type(screen.getByLabelText('RSS'), '0')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(
      await screen.findByText('Enter a whole number of days ≥ 1, or leave empty.'),
    ).toBeInTheDocument()
    expect(actions.adminUpdateRetentionAction).not.toHaveBeenCalled()
  })

  it('shows the error when saving fails', async () => {
    actions.adminUpdateRetentionAction.mockResolvedValue({ error: 'save failed' })
    const user = userEvent.setup()
    withLang(<MaintenancePanel settings={SETTINGS} />)

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('save failed')).toBeInTheDocument()
    expect(screen.queryByText('Saved.')).not.toBeInTheDocument()
    expect(refresh).not.toHaveBeenCalled()
  })

  it('starts disabled when there is no global default, and lists no providers', () => {
    withLang(<MaintenancePanel settings={{ default: null, providers: [] }} />)

    expect(screen.getByLabelText('Retention (days)')).toBeDisabled()
    expect(screen.getByLabelText('Retention (days)')).toHaveValue(null)
    expect(
      screen.getByText('No global purge. Only providers with their own value are cleaned.'),
    ).toBeInTheDocument()
    expect(screen.getByText('No providers')).toBeInTheDocument()
  })
})
