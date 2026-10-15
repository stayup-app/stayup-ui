'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { TaggedItem } from '@/types'

const LS_KEY = 'STAYUP_READ_ITEMS'

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

interface ReadContextValue {
  readIds: Set<string>
  markRead: (item: TaggedItem) => void
  markAllRead: (items: TaggedItem[]) => void
}

const ReadContext = createContext<ReadContextValue>({
  readIds: new Set(),
  markRead: () => {},
  markAllRead: () => {},
})

export function useReadContext() {
  return useContext(ReadContext)
}

export function ReadProvider({ children }: { children: ReactNode }) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) {
        setReadIds(new Set(migrateReadIds(JSON.parse(stored) as string[])))
      }
    } catch {
      /* ignore */
    }
  }, [])

  const markRead = useCallback((item: TaggedItem) => {
    const id = taggedItemId(item)
    setReadIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      try {
        localStorage.setItem(LS_KEY, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const markAllRead = useCallback((items: TaggedItem[]) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      items.forEach((item) => next.add(taggedItemId(item)))
      try {
        localStorage.setItem(LS_KEY, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  return (
    <ReadContext.Provider value={{ readIds, markRead, markAllRead }}>
      {children}
    </ReadContext.Provider>
  )
}
