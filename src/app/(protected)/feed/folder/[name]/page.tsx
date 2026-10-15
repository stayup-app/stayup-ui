import { notFound } from 'next/navigation'
import { loadFeed, toFeedRepositories } from '@/lib/feed'
import { FeedClientView } from '@/components/feed/FeedClientView'
import type { TaggedItem } from '@/types'

export default async function FolderPage({ params }: { params: Promise<{ name: string }> }) {
  const name = decodeURIComponent((await params).name)
  const { connectors, repositories, templates } = await loadFeed()

  const inFolder = repositories.filter((r) => r.folder === name)
  if (inFolder.length === 0) notFound()

  const ids = new Set(inFolder.map((r) => r.repository_id))
  const items: TaggedItem[] = Object.entries(connectors)
    .flatMap(([provider, providerItems]) =>
      providerItems
        .filter((item) => ids.has(item.repository_id))
        .map((item) => ({ provider, item })),
    )
    .sort(
      (a, b) =>
        new Date(b.item.datetime ?? b.item.executed_at).getTime() -
        new Date(a.item.datetime ?? a.item.executed_at).getTime(),
    )

  return (
    <FeedClientView
      items={items}
      repositories={toFeedRepositories(repositories)}
      templates={templates}
    />
  )
}
