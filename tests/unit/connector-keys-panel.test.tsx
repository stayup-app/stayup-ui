import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConnectorKeysPanel } from '@/components/admin/ConnectorKeysPanel'
import { LanguageProvider } from '@/context/LanguageContext'
import type { ConnectorKey } from '@/lib/api-client'

const refresh = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }))

const actions = vi.hoisted(() => ({
  adminCreateConnectorKeyAction: vi.fn(),
  adminRevokeConnectorKeyAction: vi.fn(),
}))
vi.mock('@/lib/admin-actions', () => actions)

function withLang(ui: React.ReactElement) {
  return render(<LanguageProvider initialLang="en">{ui}</LanguageProvider>)
}

const KEY: ConnectorKey = {
  id: 'k1',
  provider: 'rss',
  name: 'prod rss key',
  key_prefix: 'ab12cd34',
  created_at: '2026-02-01T00:00:00Z',
  last_used_at: '2026-03-01T00:00:00Z',
  revoked_at: null,
}

beforeEach(() => {
  vi.clearAllMocks()
  actions.adminCreateConnectorKeyAction.mockResolvedValue({ key: 'stayup_conn_deadbeef' })
  actions.adminRevokeConnectorKeyAction.mockResolvedValue({})
})

describe('ConnectorKeysPanel', () => {
  it('shows the empty state', () => {
    withLang(<ConnectorKeysPanel keys={[]} />)
    expect(screen.getByText('No keys yet')).toBeInTheDocument()
  })

  it('renders a key row with its masked prefix', () => {
    withLang(<ConnectorKeysPanel keys={[KEY]} />)
    expect(screen.getByText('rss')).toBeInTheDocument()
    expect(screen.getByText('prod rss key')).toBeInTheDocument()
    expect(screen.getByText('stayup_conn_ab12cd34…')).toBeInTheDocument()
  })

  it('creates a key and reveals the secret once', async () => {
    const user = userEvent.setup()
    withLang(<ConnectorKeysPanel keys={[]} />)

    await user.click(screen.getByRole('button', { name: 'New key' }))
    const dialog = await screen.findByRole('dialog')

    await user.type(within(dialog).getByLabelText('Provider'), 'youtube')
    await user.type(within(dialog).getByLabelText('Label'), 'yt key')
    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    await waitFor(() =>
      expect(actions.adminCreateConnectorKeyAction).toHaveBeenCalledWith({
        provider: 'youtube',
        name: 'yt key',
      }),
    )
    expect(await within(dialog).findByText('stayup_conn_deadbeef')).toBeInTheDocument()
    expect(refresh).toHaveBeenCalled()
  })

  it('keeps Create disabled until both fields are filled', async () => {
    const user = userEvent.setup()
    withLang(<ConnectorKeysPanel keys={[]} />)
    await user.click(screen.getByRole('button', { name: 'New key' }))
    const dialog = await screen.findByRole('dialog')

    expect(within(dialog).getByRole('button', { name: 'Create' })).toBeDisabled()
    await user.type(within(dialog).getByLabelText('Provider'), 'rss')
    expect(within(dialog).getByRole('button', { name: 'Create' })).toBeDisabled()
    await user.type(within(dialog).getByLabelText('Label'), 'k')
    expect(within(dialog).getByRole('button', { name: 'Create' })).toBeEnabled()
  })

  it('surfaces a creation error', async () => {
    actions.adminCreateConnectorKeyAction.mockResolvedValue({
      error: 'provider and name are required',
    })
    const user = userEvent.setup()
    withLang(<ConnectorKeysPanel keys={[]} />)
    await user.click(screen.getByRole('button', { name: 'New key' }))
    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText('Provider'), 'rss')
    await user.type(within(dialog).getByLabelText('Label'), 'k')
    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    expect(await within(dialog).findByText('provider and name are required')).toBeInTheDocument()
  })

  it('revokes a key after confirmation and refreshes', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()
    withLang(<ConnectorKeysPanel keys={[KEY]} />)

    await user.click(screen.getByRole('button', { name: 'Revoke' }))

    await waitFor(() => expect(actions.adminRevokeConnectorKeyAction).toHaveBeenCalledWith('k1'))
    expect(refresh).toHaveBeenCalled()
    confirmSpy.mockRestore()
  })

  it('does not revoke when the confirmation is dismissed', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    withLang(<ConnectorKeysPanel keys={[KEY]} />)

    await user.click(screen.getByRole('button', { name: 'Revoke' }))

    expect(actions.adminRevokeConnectorKeyAction).not.toHaveBeenCalled()
    confirmSpy.mockRestore()
  })

  it('marks an already-revoked key and offers no revoke button', () => {
    withLang(
      <ConnectorKeysPanel
        keys={[{ ...KEY, revoked_at: '2026-04-01T00:00:00Z', last_used_at: null }]}
      />,
    )
    expect(screen.getByText('Revoked')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Revoke' })).not.toBeInTheDocument()
    expect(screen.getByText('never')).toBeInTheDocument()
  })
})
