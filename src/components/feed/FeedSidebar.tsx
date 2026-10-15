'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronRight,
  FolderInput,
  Folder,
  Plus,
  Trash2,
  LayoutGrid,
  RefreshCw,
} from 'lucide-react'
import { AddFluxDialog } from './AddFluxDialog'
import { ImportExportButtons } from './ImportExportButtons'
import { LinkPendingSpinner } from '@/components/ui/link-pending-spinner'
import { cn, providerDisplayName } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'
import type { Provider, UserRepository } from '@/types'
import type { ProviderMeta } from '@/lib/providerTemplate'
import { providerIcon, providerAccent } from './providerIcons'

/** A provider's metadata for the sidebar, derived from its template. */
function getProviderMeta(provider: Provider, templates: Record<string, ProviderMeta>) {
  const meta = templates[provider]
  const color = providerAccent(meta)
  return {
    label: meta?.template?.display?.name || meta?.displayName || providerDisplayName(provider),
    color,
    dimColor: meta?.template?.display?.accent ? `${color}22` : 'var(--surface-2)',
    icon: providerIcon(meta?.template?.display),
  }
}

interface FeedSidebarProps {
  fluxes: UserRepository[]
  templates: Record<string, ProviderMeta>
  unreadCountByRepoId?: Record<number, number>
  width?: number
}

export function FeedSidebar({
  fluxes,
  templates,
  unreadCountByRepoId = {},
  width = 220,
}: FeedSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [addOpen, setAddOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [deleting, setDeleting] = useState<string | null>(null)
  const [isRefreshing, startRefresh] = useTransition()

  // The per-item "deleting" indicator stays lit until the refreshed list has
  // actually landed, not just until the DELETE request resolves.
  useEffect(() => {
    if (!isRefreshing) setDeleting(null)
  }, [isRefreshing])

  const folderNames = [
    ...new Set(fluxes.map((f) => f.folder).filter((f): f is string => !!f)),
  ].sort()

  const byProvider = fluxes
    .filter((flux) => !flux.folder)
    .reduce<Partial<Record<Provider, UserRepository[]>>>((acc, flux) => {
      ;(acc[flux.provider] ??= []).push(flux)
      return acc
    }, {})

  const providers = Object.keys(byProvider) as Provider[]

  function isExpanded(provider: Provider) {
    return expanded[provider] !== false
  }

  function toggleExpanded(provider: Provider) {
    setExpanded((prev) => ({ ...prev, [provider]: !isExpanded(provider) }))
  }

  async function handleDelete(flux: UserRepository, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm(t.feed.confirmDelete.replace('{id}', flux.identifier))) return
    setDeleting(flux.id)
    await fetch(`/api/fluxes/${flux.id}`, { method: 'DELETE' })
    startRefresh(() => router.refresh())
  }

  async function handleFolder(flux: UserRepository, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const name = window.prompt(t.feed.folderPrompt, flux.folder ?? '')
    if (name === null) return
    await fetch(`/api/fluxes/${flux.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: name.trim() || null }),
    })
    startRefresh(() => router.refresh())
  }

  function handleRefresh() {
    startRefresh(() => router.refresh())
  }

  function renderFlux(flux: UserRepository, meta: ReturnType<typeof getProviderMeta>) {
    const fluxHref = `/feed/flux/${flux.id}`
    const isActive = pathname === fluxHref
    const fluxUnread = unreadCountByRepoId[flux.repositoryId] ?? 0

    return (
      <div
        key={flux.id}
        className={cn(
          'group flex items-center rounded-md transition-colors',
          isActive ? '' : 'hover:bg-accent',
        )}
        style={isActive ? { background: 'var(--surface-3)' } : undefined}
      >
        {isActive && (
          <div
            className="w-0.5 h-4 rounded-full mr-1 shrink-0"
            style={{ background: meta.color }}
          />
        )}
        <Link
          href={fluxHref}
          className={cn(
            'flex flex-1 items-center gap-1 px-2 py-1 text-[14px] font-mono min-w-0',
            isActive
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <span className="truncate">{flux.identifier}</span>
          {fluxUnread > 0 && (
            <span
              className="text-[12px] font-mono px-1 rounded shrink-0"
              style={{ background: meta.dimColor, color: meta.color }}
            >
              {fluxUnread}
            </span>
          )}
          <LinkPendingSpinner />
        </Link>
        <button
          onClick={(e) => handleFolder(flux, e)}
          className="shrink-0 p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
          aria-label={t.feed.moveToFolder}
          title={t.feed.moveToFolder}
        >
          <FolderInput className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => handleDelete(flux, e)}
          disabled={deleting === flux.id}
          className="shrink-0 p-1 mr-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity disabled:opacity-50"
          aria-label={t.feed.deleteAriaLabel}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    )
  }

  const isAllActive = pathname === '/feed'

  return (
    <aside className="shrink-0 overflow-y-auto" style={{ width, minWidth: 120, maxWidth: 500 }}>
      <div className="pr-3 pt-1">
        {/* All feed link */}
        <Link
          href="/feed"
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-md text-[15px] transition-colors mb-3',
            isAllActive
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground',
          )}
          style={isAllActive ? { background: 'var(--surface-3)' } : undefined}
        >
          <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1">{t.feed.allFeed}</span>
          <LinkPendingSpinner />
        </Link>

        {/* My feeds section */}
        <div className="flex items-center justify-between mb-2 px-2">
          <span
            className="text-[12px] font-mono font-semibold uppercase tracking-widest"
            style={{ color: 'var(--dim)' }}
          >
            {t.feed.myFeeds}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              style={{ border: '1px solid hsl(var(--border))' }}
              aria-label={t.feed.refresh}
            >
              <RefreshCw className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
              style={{ border: '1px solid hsl(var(--border))' }}
              aria-label={t.feed.add}
            >
              <Plus className="h-3 w-3" />
            </button>
            <ImportExportButtons fluxes={fluxes} />
          </div>
        </div>

        {providers.length === 0 && folderNames.length === 0 ? (
          <div className="py-6 text-center px-2">
            <p className="text-[14px] text-muted-foreground mb-3">{t.feed.noFlux}</p>
            <button
              onClick={() => setAddOpen(true)}
              className="text-[13px] font-medium px-3 py-1.5 rounded-md transition-colors"
              style={{ background: 'var(--teal-dim)', color: 'var(--teal)' }}
            >
              {t.feed.addShort}
            </button>
          </div>
        ) : (
          <nav className="space-y-0.5">
            {folderNames.map((folder) => {
              const href = `/feed/folder/${encodeURIComponent(folder)}`
              const folderFluxes = fluxes.filter((f) => f.folder === folder)
              const unread = folderFluxes.reduce(
                (sum, flux) => sum + (unreadCountByRepoId[flux.repositoryId] ?? 0),
                0,
              )
              const active = pathname === href
              return (
                <div key={`folder-${folder}`} className="mb-1">
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center gap-2 px-2 py-1.5 text-[15px] rounded-md transition-colors',
                      active
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    style={active ? { background: 'var(--surface-3)' } : undefined}
                  >
                    <Folder className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate flex-1">{folder}</span>
                    {unread > 0 && (
                      <span
                        className="text-[12px] font-mono px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: 'var(--teal-dim)', color: 'var(--teal)' }}
                      >
                        {unread}
                      </span>
                    )}
                    <LinkPendingSpinner />
                  </Link>
                  <div className="ml-7 mt-0.5 space-y-0.5">
                    {folderFluxes.map((flux) =>
                      renderFlux(flux, getProviderMeta(flux.provider, templates)),
                    )}
                  </div>
                </div>
              )
            })}
            {providers.map((provider) => {
              const meta = getProviderMeta(provider, templates)
              const categoryHref = `/feed/category/${provider}`
              const isCategoryActive = pathname === categoryHref
              const open = isExpanded(provider)
              const providerFluxes = byProvider[provider] ?? []
              const totalUnread = providerFluxes.reduce(
                (sum, flux) => sum + (unreadCountByRepoId[flux.repositoryId] ?? 0),
                0,
              )

              return (
                <div key={provider}>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => toggleExpanded(provider)}
                      aria-label={meta.label}
                      className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                    >
                      {open ? (
                        <ChevronDown className="h-3 w-3 transition-transform" />
                      ) : (
                        <ChevronRight className="h-3 w-3 transition-transform" />
                      )}
                    </button>
                    <Link
                      href={categoryHref}
                      className={cn(
                        'flex flex-1 items-center gap-2 px-2 py-1.5 text-[15px] rounded-md transition-colors',
                        isCategoryActive
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                      style={isCategoryActive ? { background: 'var(--surface-3)' } : undefined}
                    >
                      <span style={{ color: meta.color }}>{meta.icon}</span>
                      <span className="truncate flex-1">{meta.label}</span>
                      {totalUnread > 0 && (
                        <span
                          className="text-[12px] font-mono px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ background: meta.dimColor, color: meta.color }}
                        >
                          {totalUnread}
                        </span>
                      )}
                      <LinkPendingSpinner />
                    </Link>
                  </div>

                  {open && (
                    <div className="ml-7 mt-0.5 space-y-0.5 mb-1">
                      {providerFluxes.map((flux) => renderFlux(flux, meta))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        )}
      </div>

      <AddFluxDialog open={addOpen} onOpenChange={setAddOpen} />
    </aside>
  )
}
