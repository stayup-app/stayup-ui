import { getCachedUserFeed, getCachedTemplates } from './feed-cache'
import { readInstances, type Instance } from './instances'
import { decodeToken, isTokenExpired } from './session'
import { ApiError } from './api-client'
import type { ProviderMeta } from './providerTemplate'
import type { ConnectorItem, FeedRepository } from '@/types'
import type { UserRepositoryItem } from './api-client'

/** Why an instance is missing from the feed:
 *  - `expired`     : the token carries a past `exp` (seen locally);
 *  - `auth`        : the API rejected the token (401/403) or it is unreadable;
 *  - `unreachable` : network or 5xx, probably transient.
 *  `expired` and `auth` need a reconnect; `unreachable` a simple retry. */
export type InstanceErrorReason = 'expired' | 'auth' | 'unreachable'

export interface InstanceError {
  instanceId: string
  instanceName: string
  reason: InstanceErrorReason
}

/** The instances whose session is dead: reconnect required, a simple retry will
 *  not help. */
export function needsReconnect(errors: InstanceError[]): InstanceError[] {
  return errors.filter((e) => e.reason === 'expired' || e.reason === 'auth')
}

/** A feed row, tagged with the instance it comes from. `_instance_name` is only
 *  set in multi-instance mode (it is only used to show a badge). */
export type TaggedRepository = UserRepositoryItem & {
  _instance_id: string
  _instance_name?: string
}

/** A connector item, tagged with the instance it comes from (mirrors the
 *  `_data_source_*` pattern of multi-database). */
export type FanoutItem = ConnectorItem & {
  _instance_id: string
  _instance_name?: string
}

export interface FanoutFeed {
  /** All live instances, in order (the first is the primary). */
  instances: Instance[]
  repositories: TaggedRepository[]
  /** Items merged flat, indexed by provider. */
  connectors: Record<string, FanoutItem[]>
  /** Templates merged flat (first wins), indexed by provider. */
  templates: Record<string, ProviderMeta>
  /** Instances whose fetch failed — the feed still renders the others. */
  instanceErrors: InstanceError[]
}

function userIdOf(token: string): string | null {
  try {
    return decodeToken(token).userId
  } catch {
    return null
  }
}

/** Merges template maps: the first provider seen wins, but a missing template
 *  is filled in by a later instance. */
export function mergeTemplates(
  into: Record<string, ProviderMeta>,
  from: Record<string, ProviderMeta>,
): void {
  for (const [name, meta] of Object.entries(from)) {
    if (!into[name] || (!into[name].template && meta.template)) into[name] = meta
  }
}

/** Fetches each live instance's feed in parallel, tags each row with its
 *  instance and merges everything. An instance's failure is soft: it goes into
 *  `instanceErrors`, the others are rendered. */
export async function fanoutFeed(): Promise<FanoutFeed> {
  const instances = await readInstances()

  const results = await Promise.all(
    instances.map(async (inst) => {
      if (isTokenExpired(inst.token)) {
        return { inst, failed: true as const, reason: 'expired' as const }
      }
      const userId = userIdOf(inst.token)
      if (!userId) return { inst, failed: true as const, reason: 'auth' as const }
      try {
        const [feed, templates] = await Promise.all([
          getCachedUserFeed(userId, inst.token, inst.url),
          getCachedTemplates(inst.token, inst.url),
        ])
        return { inst, failed: false as const, feed, templates }
      } catch (e) {
        // 401/403 = rejected token (reconnect); the rest = unreachable (retry).
        const reason: InstanceErrorReason =
          e instanceof ApiError && (e.status === 401 || e.status === 403) ? 'auth' : 'unreachable'
        return { inst, failed: true as const, reason }
      }
    }),
  )

  const repositories: TaggedRepository[] = []
  const connectors: Record<string, FanoutItem[]> = {}
  const templates: Record<string, ProviderMeta> = {}
  const instanceErrors: InstanceError[] = []
  const multi = instances.length > 1

  for (const r of results) {
    if (r.failed) {
      instanceErrors.push({
        instanceId: r.inst.id,
        instanceName: r.inst.name,
        reason: r.reason,
      })
      continue
    }
    const tag = {
      _instance_id: r.inst.id,
      ...(multi ? { _instance_name: r.inst.name } : {}),
    }
    for (const repo of r.feed.repositories) repositories.push({ ...repo, ...tag })
    for (const [provider, items] of Object.entries(r.feed.connectors ?? {})) {
      ;(connectors[provider] ??= []).push(...items.map((item) => ({ ...item, ...tag })))
    }
    mergeTemplates(templates, r.templates)
  }

  return { instances, repositories, connectors, templates, instanceErrors }
}

/** Reduces the tagged rows to the `FeedRepository` shape the views expect,
 *  keeping the origin instance. */
export function toFeedRepositories(repositories: TaggedRepository[]): FeedRepository[] {
  return repositories.map((r) => ({
    repository_id: r.repository_id,
    url: r.url,
    provider: r.provider,
    config: r.config ?? {},
    instanceId: r._instance_id,
  }))
}
