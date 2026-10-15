import { beforeEach, describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorLogPanel } from '@/components/admin/ErrorLogPanel'
import { LanguageProvider } from '@/context/LanguageContext'
import { en } from '@/lib/translations'
import type { ErrorLog } from '@/lib/api-client'

const refresh = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }))

const clearAction = vi.hoisted(() => vi.fn())
vi.mock('@/lib/admin-actions', () => ({ adminClearErrorLogsAction: clearAction }))

function withLang(ui: React.ReactElement) {
  return render(<LanguageProvider initialLang="en">{ui}</LanguageProvider>)
}

const LOG: ErrorLog = {
  id: 1,
  repository_id: 4,
  url: 'https://blog.dev/feed.xml',
  provider: 'rss',
  error: 'HTTP 500 from the feed',
  executed_at: '2026-10-15T08:00:00Z',
}

describe('ErrorLogPanel', () => {
  it('lists each failure with its source and message', () => {
    withLang(<ErrorLogPanel logs={[LOG]} />)

    expect(screen.getByText(en.admin.maintenance.logsHeading)).toBeInTheDocument()
    expect(screen.getByText('https://blog.dev/feed.xml')).toBeInTheDocument()
    expect(screen.getByText('HTTP 500 from the feed')).toBeInTheDocument()
    expect(screen.getByText('Rss')).toBeInTheDocument()
  })

  it('copes with a failure whose repository no longer exists', () => {
    withLang(<ErrorLogPanel logs={[{ ...LOG, url: null, provider: null, repository_id: null }]} />)
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText('HTTP 500 from the feed')).toBeInTheDocument()
  })

  it('says so when nothing failed', () => {
    withLang(<ErrorLogPanel logs={[]} />)
    expect(screen.getByText(en.admin.maintenance.logsNone)).toBeInTheDocument()
  })

  it('shows an error when the log cannot be loaded', () => {
    withLang(<ErrorLogPanel logs={null} />)
    expect(screen.getByText(en.admin.maintenance.logsLoadError)).toBeInTheDocument()
  })

  it('keeps an unparseable date as is', () => {
    withLang(<ErrorLogPanel logs={[{ ...LOG, executed_at: 'not a date' }]} />)
    expect(screen.getByText('not a date')).toBeInTheDocument()
  })

  describe('clearing the log', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      clearAction.mockResolvedValue({})
    })

    it('asks for confirmation, then empties the log and refreshes', async () => {
      const user = userEvent.setup()
      withLang(<ErrorLogPanel logs={[LOG]} />)

      await user.click(screen.getByRole('button', { name: en.admin.maintenance.clearLogs }))
      expect(clearAction).not.toHaveBeenCalled()
      expect(screen.getByText(en.admin.maintenance.confirmClearLogs)).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: en.admin.confirm }))

      await waitFor(() => expect(clearAction).toHaveBeenCalledTimes(1))
      expect(refresh).toHaveBeenCalled()
    })

    it('does nothing when the confirmation is cancelled', async () => {
      const user = userEvent.setup()
      withLang(<ErrorLogPanel logs={[LOG]} />)

      await user.click(screen.getByRole('button', { name: en.admin.maintenance.clearLogs }))
      await user.click(screen.getByRole('button', { name: en.admin.cancel }))

      expect(clearAction).not.toHaveBeenCalled()
      expect(
        screen.getByRole('button', { name: en.admin.maintenance.clearLogs }),
      ).toBeInTheDocument()
    })

    it('shows the error when the log cannot be cleared', async () => {
      clearAction.mockResolvedValue({ error: 'boom' })
      const user = userEvent.setup()
      withLang(<ErrorLogPanel logs={[LOG]} />)

      await user.click(screen.getByRole('button', { name: en.admin.maintenance.clearLogs }))
      await user.click(screen.getByRole('button', { name: en.admin.confirm }))

      expect(await screen.findByText('boom')).toBeInTheDocument()
      expect(refresh).not.toHaveBeenCalled()
    })

    it('offers nothing to clear on an empty log', () => {
      withLang(<ErrorLogPanel logs={[]} />)
      expect(
        screen.queryByRole('button', { name: en.admin.maintenance.clearLogs }),
      ).not.toBeInTheDocument()
    })
  })
})
