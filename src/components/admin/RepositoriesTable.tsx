'use client'

import { useState } from 'react'
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
import { formatDate } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  const [viewing, setViewing] = useState<AdminRepository | null>(null)
  const [subscribers, setSubscribers] = useState<RepositorySubscriber[] | null>(null)
  const [subscribersError, setSubscribersError] = useState<string | null>(null)

  async function openSubscribers(repo: AdminRepository) {
    setViewing(repo)
    setSubscribers(null)
    setSubscribersError(null)
    const result = await adminListRepositorySubscribersAction(repo.id)
    if (result.error) setSubscribersError(result.error)
    else setSubscribers(result.subscribers ?? [])
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
            <TableHead>{t.admin.health}</TableHead>
            <TableHead>{t.admin.lastItem}</TableHead>
            <TableHead className="text-center">{t.admin.subscribers}</TableHead>
            <TableHead className="text-right">{t.admin.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repositories.map((repo) => (
            <TableRow key={repo.id}>
              <TableCell>
                <Badge variant="secondary">
                  {PROVIDER_LABELS[repo.type] ?? providerDisplayName(repo.type)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate text-sm font-mono text-muted-foreground">
                {repo.url}
              </TableCell>
              <TableCell>
                {repo.failures_since_item > 0 ? (
                  <Badge variant="destructive" title={repo.last_error ?? undefined}>
                    {t.admin.healthFailing.replace('{n}', String(repo.failures_since_item))}
                  </Badge>
                ) : (
                  <Badge variant="secondary">{t.admin.healthOk}</Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {repo.last_item_at ? formatDate(repo.last_item_at) : t.admin.neverCollected}
              </TableCell>
              <TableCell className="text-center text-sm">
                {Number(repo.subscriber_count) > 0 ? (
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={`${t.admin.subscribers} (${repo.subscriber_count})`}
                    className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                    onClick={() => void openSubscribers(repo)}
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
          ))}
          {repositories.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                {t.admin.noFlux}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={viewing !== null}
        onOpenChange={(open) => {
          if (!open) setViewing(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.admin.subscribers}</DialogTitle>
            <DialogDescription className="font-mono break-all">{viewing?.url}</DialogDescription>
          </DialogHeader>
          {subscribersError ? (
            <p className="text-sm text-destructive">{subscribersError}</p>
          ) : subscribers === null ? (
            <p className="text-sm text-muted-foreground">…</p>
          ) : subscribers.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.admin.noSubscribers}</p>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.admin.name}</TableHead>
                    <TableHead>{t.admin.email}</TableHead>
                    <TableHead>{t.admin.subscribedSince}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.name}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{sub.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(sub.subscribed_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
