'use client'

import { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  adminDeleteRepositoryAction,
  adminClearRepositoryDataAction,
  adminListRepositorySubscribersAction,
} from '@/lib/admin-actions'
import type { AdminRepository, RepositorySubscriber } from '@/lib/api-client'
import { providerDisplayName } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/context/LanguageContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const PROVIDER_LABELS: Record<string, string> = {
  changelog: 'Changelog',
  youtube: 'YouTube',
  rss: 'RSS',
  scrap: 'Scrap',
}

type ConfirmMode = 'data' | 'full'

export function RepositoriesTable({ repositories }: { repositories: AdminRepository[] }) {
  const router = useRouter()
  const { t } = useLanguage()
  const [pending, setPending] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ id: number; mode: ConfirmMode } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<number | null>(null)
  const [subscribers, setSubscribers] = useState<Record<number, RepositorySubscriber[]>>({})
  const [loadingId, setLoadingId] = useState<number | null>(null)

  async function toggleSubscribers(repoId: number) {
    if (openId === repoId) {
      setOpenId(null)
      return
    }
    setOpenId(repoId)
    setError(null)
    setLoadingId(repoId)
    const result = await adminListRepositorySubscribersAction(repoId)
    setLoadingId(null)
    if (result.error) setError(result.error)
    else setSubscribers((prev) => ({ ...prev, [repoId]: result.subscribers ?? [] }))
  }

  async function handleClearData(repoId: number) {
    setPending(`data-${repoId}`)
    setError(null)
    const result = await adminClearRepositoryDataAction(repoId)
    setPending(null)
    setConfirm(null)
    if (result.error) setError(result.error)
    else router.refresh()
  }

  async function handleDelete(repoId: number) {
    setPending(`delete-${repoId}`)
    setError(null)
    const result = await adminDeleteRepositoryAction(repoId)
    setPending(null)
    setConfirm(null)
    if (result.error) setError(result.error)
    else router.refresh()
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.admin.type}</TableHead>
            <TableHead>{t.admin.url}</TableHead>
            <TableHead className="text-center">{t.admin.subscribers}</TableHead>
            <TableHead className="text-right">{t.admin.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repositories.map((repo) => (
            <Fragment key={repo.id}>
              <TableRow>
                <TableCell>
                  <Badge variant="secondary">
                    {PROVIDER_LABELS[repo.type] ?? providerDisplayName(repo.type)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm font-mono text-muted-foreground">
                  {repo.url}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {Number(repo.subscriber_count) > 0 ? (
                    <button
                      type="button"
                      aria-expanded={openId === repo.id}
                      aria-label={`${t.admin.subscribers} (${repo.subscriber_count})`}
                      className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                      onClick={() => void toggleSubscribers(repo.id)}
                    >
                      {repo.subscriber_count}
                    </button>
                  ) : (
                    repo.subscriber_count
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {confirm?.id === repo.id ? (
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xs text-muted-foreground mr-1">
                        {confirm.mode === 'data'
                          ? t.admin.confirmClearData
                          : t.admin.confirmDeleteFlux}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={pending !== null}
                        onClick={() =>
                          confirm.mode === 'data' ? handleClearData(repo.id) : handleDelete(repo.id)
                        }
                      >
                        {pending !== null ? '…' : t.admin.confirm}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirm(null)}>
                        {t.admin.cancel}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirm({ id: repo.id, mode: 'data' })}
                      >
                        {t.admin.clearData}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setConfirm({ id: repo.id, mode: 'full' })}
                      >
                        {t.admin.delete}
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
              {openId === repo.id && (
                <TableRow>
                  <TableCell colSpan={4} className="bg-muted/30">
                    {loadingId === repo.id ? (
                      <p className="text-sm text-muted-foreground">…</p>
                    ) : (subscribers[repo.id] ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t.admin.noSubscribers}</p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {(subscribers[repo.id] ?? []).map((sub) => (
                          <li key={sub.id} className="flex items-baseline gap-2">
                            <span className="font-medium">{sub.name}</span>
                            <span className="font-mono text-muted-foreground">{sub.email}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
          {repositories.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                {t.admin.noFlux}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
