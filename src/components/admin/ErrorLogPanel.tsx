'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useLanguage } from '@/context/LanguageContext'
import { adminClearErrorLogsAction } from '@/lib/admin-actions'
import { providerDisplayName } from '@/lib/utils'
import type { ErrorLog } from '@/lib/api-client'

function formatDateTime(value: string): string {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString()
}

export function ErrorLogPanel({ logs }: { logs: ErrorLog[] | null }) {
  const router = useRouter()
  const { t } = useLanguage()
  const mp = t.admin.maintenance
  const [confirming, setConfirming] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function clear() {
    setClearing(true)
    setError(null)
    const result = await adminClearErrorLogsAction()
    setClearing(false)
    setConfirming(false)
    if (result.error) setError(result.error)
    else router.refresh()
  }

  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">{mp.logsHeading}</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">{mp.logsHint}</p>
        </div>
        {logs !== null && logs.length > 0 && (
          <div className="flex shrink-0 items-center gap-2">
            {confirming ? (
              <>
                <span className="text-xs text-muted-foreground">{mp.confirmClearLogs}</span>
                <Button variant="destructive" size="sm" disabled={clearing} onClick={clear}>
                  {clearing ? mp.clearingLogs : t.admin.confirm}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={clearing}
                  onClick={() => setConfirming(false)}
                >
                  {t.admin.cancel}
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
                {mp.clearLogs}
              </Button>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {logs === null ? (
        <p className="text-sm text-destructive">{mp.logsLoadError}</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{mp.logsNone}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">{mp.logDate}</TableHead>
              <TableHead>{mp.logSource}</TableHead>
              <TableHead>{mp.logError}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatDateTime(log.executed_at)}
                </TableCell>
                <TableCell className="max-w-xs text-sm">
                  {log.provider && (
                    <Badge variant="secondary" className="mr-2">
                      {providerDisplayName(log.provider)}
                    </Badge>
                  )}
                  <span className="font-mono text-muted-foreground break-all">
                    {log.url ?? '—'}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-mono break-words">{log.error}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
