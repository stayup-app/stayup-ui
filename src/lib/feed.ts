import { redirect } from 'next/navigation'
import { ApiError } from './api-client'
import { getCachedUserFeed } from './feed-cache'
import { PROVIDERS } from './providers'
import { decodeToken, getToken } from './session'
import type { ProviderMeta } from './providerTemplate'
import type { FeedRepository } from '@/types'
import type { UserFeedResponse, UserRepositoryItem } from './api-client'

export interface LoadedFeed extends UserFeedResponse {
  userId: string
  templates: Record<string, ProviderMeta>
}

/** The signed-in user's feed. A missing, expired or rejected session sends the
 *  visitor back to the login page; any other failure reaches the error boundary. */
export async function loadFeed(): Promise<LoadedFeed> {
  const token = await getToken()
  if (!token) redirect('/login')
  let userId: string
  try {
    userId = decodeToken(token).userId
  } catch {
    redirect('/login')
  }
  try {
    const feed = await getCachedUserFeed(userId, token)
    return { ...feed, userId, templates: PROVIDERS }
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect('/login')
    throw e
  }
}

/** Reduces the repositories to the `FeedRepository` shape the views expect. */
export function toFeedRepositories(repositories: UserRepositoryItem[]): FeedRepository[] {
  return repositories.map((r) => ({
    repository_id: r.repository_id,
    url: r.url,
    provider: r.provider,
    config: r.config ?? {},
  }))
}
