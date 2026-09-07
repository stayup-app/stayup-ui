'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { adminCreateConnectorKeyAction, adminRevokeConnectorKeyAction } from '@/lib/admin-actions'
import { useLanguage } from '@/context/LanguageContext'
import type { ConnectorKey } from '@/lib/api-client'

type Dict = ReturnType<typeof useLanguage>['t']['admin']['connectorKeys']

function NewKeyDialog({ ck, onDone }: { ck: Dict; onDone: () => void }) {
  const [open, setOpen] = useState(false)
  const [provider, setProvider] = useState('')
  const [name, setName] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function reset() {
    setProvider('')
    setName('')
    setPending(false)
    setError(null)
    setSecret(null)
    setCopied(false)
  }

  async function create() {
    setPending(true)
    setError(null)
    const result = await adminCreateConnectorKeyAction({
      provider: provider.trim(),
      name: name.trim(),
    })
    setPending(false)
    if (result.error || !result.key) {
      setError(result.error ?? ck.createFailed)
      return
    }
    setSecret(result.key)
    onDone()
  }

  async function copy() {
    if (!secret) return
    try {
      await navigator.clipboard.writeText(secret)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const canCreate = provider.trim() !== '' && name.trim() !== ''

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">{ck.newKey}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ck.newKey}</DialogTitle>
        </DialogHeader>

        {secret ? (
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground">{ck.shownOnce}</p>
            <code className="block break-all rounded-md border border-border bg-muted p-3 font-mono text-[13px]">
              {secret}
            </code>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={copy}>
                {copied ? ck.copied : ck.copy}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setOpen(false)
                  reset()
                }}
              >
                {ck.done}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="ck-provider">{ck.provider}</Label>
              <Input
                id="ck-provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="rss"
              />
              <p className="text-[12px] text-muted-foreground">{ck.providerHint}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ck-name">{ck.name}</Label>
              <Input
                id="ck-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={ck.namePlaceholder}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end">
              <Button type="button" onClick={create} disabled={pending || !canCreate}>
                {pending ? ck.creating : ck.create}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function KeyRow({ item, ck, onDone }: { item: ConnectorKey; ck: Dict; onDone: () => void }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const revoked = item.revoked_at !== null

  async function revoke() {
    if (!window.confirm(ck.revokeConfirm.replace('{name}', item.name))) return
    setPending(true)
    setError(null)
    const result = await adminRevokeConnectorKeyAction(item.id)
    setPending(false)
    if (result.error) setError(result.error)
    else onDone()
  }

  return (
    <TableRow className={revoked ? 'opacity-50' : undefined}>
      <TableCell className="font-medium">{item.provider}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell className="font-mono text-[13px]">{`stayup_conn_${item.key_prefix}…`}</TableCell>
      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
        {item.last_used_at ? new Date(item.last_used_at).toLocaleDateString() : ck.never}
      </TableCell>
      <TableCell className="text-right">
        {error && <span className="mr-2 text-xs text-destructive">{error}</span>}
        {revoked ? (
          <span className="text-xs text-muted-foreground">{ck.revoked}</span>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            disabled={pending}
            onClick={revoke}
          >
            {pending ? '…' : ck.revoke}
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

export function ConnectorKeysPanel({ keys }: { keys: ConnectorKey[] }) {
  const router = useRouter()
  const { t } = useLanguage()
  const ck = t.admin.connectorKeys
  const refresh = () => router.refresh()

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <NewKeyDialog ck={ck} onDone={refresh} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ck.provider}</TableHead>
            <TableHead>{ck.name}</TableHead>
            <TableHead>{ck.key}</TableHead>
            <TableHead>{ck.lastUsed}</TableHead>
            <TableHead className="text-right">{ck.action}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((item) => (
            <KeyRow key={item.id} item={item} ck={ck} onDone={refresh} />
          ))}
          {keys.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                {ck.none}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
