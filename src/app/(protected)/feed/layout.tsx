import { resolveFeedLabel } from '@/lib/providerTemplate'
import { loadFeed } from '@/lib/feed'
import { FeedClientLayout } from '@/components/feed/FeedClientLayout'
import type { Provider, UserRepository, TaggedItem } from '@/types'

export default async function FeedLayout({ children }: { children: React.ReactNode }) {
  const { userId, repositories, connectors, templates } = await loadFeed()

  const fluxes: UserRepository[] = repositories.map((repo) => ({
    id: repo.id,
    userId,
    repositoryId: repo.repository_id,
    provider: repo.provider as Provider,
    url: repo.url,
    identifier: resolveFeedLabel(templates[repo.provider]?.template ?? null, {
      url: repo.url,
      config: repo.config ?? {},
    }),
    config: repo.config ?? {},
    createdAt: repo.created_at,
  }))

  const allItems: TaggedItem[] = Object.entries(connectors).flatMap(([provider, providerItems]) =>
    providerItems.map((item) => ({ provider, item })),
  )

  return (
    <FeedClientLayout fluxes={fluxes} allItems={allItems} templates={templates}>
      {children}
    </FeedClientLayout>
  )
}
