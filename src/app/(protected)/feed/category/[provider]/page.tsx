import { notFound } from 'next/navigation'
import { loadFeed, toFeedRepositories } from '@/lib/feed'
import { FeedClientView } from '@/components/feed/FeedClientView'
import type { TaggedItem } from '@/types'

export default async function CategoryPage({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params
  const { connectors, repositories, templates } = await loadFeed()

  if (!(provider in connectors)) notFound()

  const items: TaggedItem[] = (connectors[provider] ?? []).map((item) => ({ provider, item }))

  return (
    <FeedClientView
      items={items}
      repositories={toFeedRepositories(repositories)}
      templates={templates}
    />
  )
}
