import { notFound } from 'next/navigation'
import { fanoutFeed, toFeedRepositories } from '@/lib/feed-fanout'
import { FeedClientView } from '@/components/feed/FeedClientView'
import type { TaggedItem } from '@/types'

export default async function CategoryPage({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params

  const { instances, connectors, repositories, templates, instanceErrors } = await fanoutFeed()

  if (instances.length > 0 && instanceErrors.length === instances.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
        <p className="text-sm">Impossible de charger les données. Veuillez réessayer.</p>
      </div>
    )
  }

  // The list of valid providers is 100% dynamic: the presence of the key in the
  // feed (i.e. a connector_<provider> table on the API side) is what counts.
  if (!(provider in connectors)) notFound()

  const items = (connectors[provider] ?? []).map((item) => ({ provider, item })) as TaggedItem[]

  return (
    <FeedClientView
      items={items}
      repositories={toFeedRepositories(repositories)}
      templates={templates}
      instanceErrors={instanceErrors}
    />
  )
}
