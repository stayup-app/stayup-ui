'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { TaggedItem } from '@/types'

const LS_KEY = 'STAYUP_READ_ITEMS'
/** The API takes at most this many ids per request. */
const SYNC_BATCH = 1000

/** Key for a read item: `<provider>:<id>`. */
export function taggedItemId(item: TaggedItem): string {
  return `${item.provider}:${item.item.id}`
}

/** Drops the instance segment of keys stored by versions that supported several
 *  API instances (`<instanceId>:<provider>:<id>`), keeping the read state. */
export function migrateReadIds(stored: string[]): string[] {
  return stored.map((id) => {
    const parts = id.split(':')
    return parts.length === 3 ? parts.slice(1).join(':') : id
  })
}

function itemNumber(key: string): number {
  return Number(key.slice(key.lastIndexOf(':') + 1))
}

function persist(ids: Set<string>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...ids]))
  } catch {
    /* ignore */
  }
}

/** Tells the API these keys are read. Best effort: whatever fails to go through
 *  is uploaded again at the next load, since the server then lacks it. */
async function syncRead(keys: string[]) {
  const ids = keys.map(itemNumber).filter(Number.isInteger)
  for (let i = 0; i < ids.length; i += SYNC_BATCH) {
    try {
      await fetch('/api/state/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: ids.slice(i, i + SYNC_BATCH) }),
      })
    } catch {
      /* ignore */
    }
  }
}

interface ReadContextValue {
  readIds: Set<string>
  savedIds: Set<string>
  markRead: (item: TaggedItem) => void
  markAllRead: (items: TaggedItem[]) => void
  toggleSaved: (item: TaggedItem) => void
}

const ReadContext = createContext<ReadContextValue>({
  readIds: new Set(),
  savedIds: new Set(),
  markRead: () => {},
  markAllRead: () => {},
  toggleSaved: () => {},
})

export function useReadContext() {
  return useContext(ReadContext)
}

export function ReadProvider({ children }: { children: ReactNode }) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  // The server is the source of truth across devices; the local copy only makes
  // the first paint instant, and is what gets uploaded the first time.
  useEffect(() => {
    let local: string[] = []
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) local = migrateReadIds(JSON.parse(stored) as string[])
    } catch {
      /* ignore */
    }
    if (local.length > 0) setReadIds(new Set(local))

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/state')
        if (!res.ok) return
        const state = (await res.json()) as { read?: string[]; saved?: string[] }
        if (cancelled || !Array.isArray(state.read)) return
        const server = new Set(state.read)
        const merged = new Set([...server, ...local])
        setReadIds(merged)
        setSavedIds(new Set(Array.isArray(state.saved) ? state.saved : []))
        persist(merged)
        const missing = local.filter((key) => !server.has(key))
        if (missing.length > 0) void syncRead(missing)
      } catch {
        /* offline: the local copy stands */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const markRead = useCallback((item: TaggedItem) => {
    const id = taggedItemId(item)
    setReadIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      persist(next)
      void syncRead([id])
      return next
    })
  }, [])

  const markAllRead = useCallback((items: TaggedItem[]) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      items.forEach((item) => next.add(taggedItemId(item)))
      persist(next)
      void syncRead(items.map(taggedItemId).filter((key) => !prev.has(key)))
      return next
    })
  }, [])

  const toggleSaved = useCallback((item: TaggedItem) => {
    const id = taggedItemId(item)
    setSavedIds((prev) => {
      const next = new Set(prev)
      const saved = !prev.has(id)
      if (saved) next.add(id)
      else next.delete(id)
      fetch(`/api/items/${item.item.id}/saved`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saved }),
      }).catch(() => {})
      return next
    })
  }, [])

  return (
    <ReadContext.Provider value={{ readIds, savedIds, markRead, markAllRead, toggleSaved }}>
      {children}
    </ReadContext.Provider>
  )
}
