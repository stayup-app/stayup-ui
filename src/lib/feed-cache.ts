import { cache } from 'react'
import { getUserFeed, getConnectorProviders } from './api-client'
import { buildTemplateMap, type ProviderMeta } from './providerTemplate'

export const getCachedUserFeed = cache(getUserFeed)

/**
 * Providers + display templates, indexed by name, memoized per request.
 * A failure does not break the feed: we return an empty map (generic rendering).
 */
export const getCachedTemplates = cache(
  async (token: string, baseUrl?: string): Promise<Record<string, ProviderMeta>> => {
    try {
      return buildTemplateMap(await getConnectorProviders(token, baseUrl))
    } catch {
      return {}
    }
  },
)
