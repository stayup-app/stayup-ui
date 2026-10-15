import { notFound } from 'next/navigation'
import { loadFeed, toFeedRepositories } from '@/lib/feed'
import { FeedClientView } from '@/components/feed/FeedClientView'
import type { TaggedItem } from '@/types'

export default async function FluxPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { connectors, repositories, templates } = await loadFeed()

  const repo = repositories.find((r) => r.id === id)
  if (!repo) notFound()

  const items: TaggedItem[] = (connectors[repo.provider] ?? [])
    .filter((item) => item.repository_id === repo.repository_id)
    .map((item) => ({ provider: repo.provider, item }))

  return (
    <FeedClientView
      items={items}
      repositories={toFeedRepositories(repositories)}
      templates={templates}
    />
  )
}
