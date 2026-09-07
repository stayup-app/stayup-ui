'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { adminRunCleanupAction, adminUpdateRetentionAction } from '@/lib/admin-actions'
import { useLanguage } from '@/context/LanguageContext'
import type { RetentionSettings } from '@/lib/api-client'

/** `''` → follows the default / disabled; otherwise an integer number of days ≥ 1. `null` on
 *  sortie si invalide. */
function parseField(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed === '') return null
  const n = Number(trimmed)
  if (!Number.isInteger(n) || n < 1) return null
  return n
}

export function MaintenancePanel({ settings }: { settings: RetentionSettings | null }) {
  const router = useRouter()
  const { t } = useLanguage()
  const mp = t.admin.maintenance

  if (!settings) {
    return <p className="text-sm text-destructive">{mp.loadError}</p>
  }

  return <Panel settings={settings} mp={mp} onSaved={() => router.refresh()} />
}

function Panel({
  settings,
  mp,
  onSaved,
}: {
  settings: RetentionSettings
  mp: ReturnType<typeof useLanguage>['t']['admin']['maintenance']
  onSaved: () => void
}) {
  const [disabled, setDisabled] = useState(settings.default === null)
  const [globalDays, setGlobalDays] = useState(
    settings.default === null ? '' : String(settings.default),
  )
  const [overrides, setOverrides] = useState<Record<string, string>>(
    Object.fromEntries(
      settings.providers.map((p) => [
        p.name,
        p.retention_days === null ? '' : String(p.retention_days),
      ]),
    ),
  )

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState<string | null>(null)
  const [runTotal, setRunTotal] = useState<number | null>(null)

  async function save() {
    setSaveError(null)
    setSaved(false)

    const body: { default: number | null; providers: Record<string, number | null> } = {
      default: null,
      providers: {},
    }

    if (disabled) {
      body.default = null
    } else {
      const d = parseField(globalDays)
      if (d === null) {
        setSaveError(mp.invalidDays)
        return
      }
      body.default = d
    }

    for (const p of settings.providers) {
      const raw = overrides[p.name] ?? ''
      if (raw.trim() === '') {
        body.providers[p.name] = null
        continue
      }
      const d = parseField(raw)
      if (d === null) {
        setSaveError(mp.invalidDays)
        return
      }
      body.providers[p.name] = d
    }

    setSaving(true)
    const result = await adminUpdateRetentionAction(body)
    setSaving(false)
    if (result.error) {
      setSaveError(result.error)
      return
    }
    setSaved(true)
    onSaved()
  }

  async function run() {
    setRunError(null)
    setRunTotal(null)
    setRunning(true)
    const result = await adminRunCleanupAction()
    setRunning(false)
    if (result.error) {
      setRunError(result.error)
      return
    }
    setRunTotal(result.total ?? 0)
    onSaved()
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Global default */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold">{mp.globalHeading}</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">{mp.globalHint}</p>
        </div>
        <div className="flex items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="retention-global">{mp.daysLabel}</Label>
            <Input
              id="retention-global"
              type="number"
              min={1}
              className="w-28"
              disabled={disabled}
              value={globalDays}
              onChange={(e) => {
                setGlobalDays(e.target.value)
                setSaved(false)
              }}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => {
              setDisabled(e.target.checked)
              setSaved(false)
            }}
          />
          {mp.disableGlobal}
        </label>
        {disabled && <p className="text-[12px] text-muted-foreground">{mp.disabledNote}</p>}
      </section>

      {/* Per-provider overrides */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold">{mp.overridesHeading}</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">{mp.overridesHint}</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{mp.provider}</TableHead>
              <TableHead className="w-40">{mp.daysLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.providers.map((p) => (
              <TableRow key={p.name}>
                <TableCell className="font-medium">{p.displayName}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    aria-label={p.displayName}
                    className="w-28"
                    placeholder={mp.followsGlobal}
                    value={overrides[p.name] ?? ''}
                    onChange={(e) => {
                      setOverrides((o) => ({ ...o, [p.name]: e.target.value }))
                      setSaved(false)
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {settings.providers.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                  {mp.none}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? '…' : mp.save}
        </Button>
        {saved && <span className="text-sm text-muted-foreground">{mp.saved}</span>}
        {saveError && <span className="text-sm text-destructive">{saveError}</span>}
      </div>

      {/* Purge manuelle */}
      <section className="space-y-3 pt-6" style={{ borderTop: '1px solid hsl(var(--border))' }}>
        <div>
          <h2 className="text-sm font-semibold">{mp.runHeading}</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">{mp.runHint}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={run} disabled={running}>
            {running ? mp.running : mp.runButton}
          </Button>
          {runTotal !== null && (
            <span className="text-sm text-muted-foreground">
              {runTotal === 0 ? mp.runResultZero : mp.runResult.replace('{n}', String(runTotal))}
            </span>
          )}
          {runError && <span className="text-sm text-destructive">{runError}</span>}
        </div>
      </section>
    </div>
  )
}
