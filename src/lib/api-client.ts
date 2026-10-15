import type { ConnectorItem, FluxRequest, ProviderFlux } from '@/types'
import { getApiUrl } from './apiUrl'

/** API call error carrying the HTTP status: branching on the message text made
 *  the code depend on the language and the exact wording the API returns. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
  attempt = 0,
): Promise<T> {
  const isGet = !init?.method || init.method === 'GET'
  const baseUrl = await getApiUrl()

  // `cache` and `next.revalidate` are mutually exclusive: setting both (which
  // the `init` spread before the cache one did) let a `no-store` response be
  // revalidated at 60 s — a feed frozen after adding a flux.
  const cacheOptions: RequestInit =
    init && ('cache' in init || 'next' in init)
      ? {}
      : isGet
        ? ({ next: { revalidate: 60 } } as RequestInit)
        : { cache: 'no-store' }

  let res: Response
  try {
    res = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
      ...cacheOptions,
    })
  } catch (err) {
    // A POST/DELETE may have been processed before the cut: replaying it would
    // create a duplicate. Only reads are retried.
    if (isGet && attempt === 0) return apiFetch<T>(path, token, init, 1)
    throw err
  }

  if (!res.ok) {
    if (isGet && res.status >= 500 && attempt === 0) {
      return apiFetch<T>(path, token, init, 1)
    }
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new ApiError(res.status, body.error ?? `StayUp API error ${res.status}: ${path}`)
  }
  return res.json() as Promise<T>
}

// ─── Auth config ──────────────────────────────────────────────────────────────

export interface AuthConfig {
  emailPassword: boolean
  oauth: { google: boolean; github: boolean }
}

function isAuthConfig(v: unknown): v is AuthConfig {
  if (!v || typeof v !== 'object') return false
  const c = v as Record<string, unknown>
  const o = c.oauth as Record<string, unknown> | null | undefined
  return (
    typeof c.emailPassword === 'boolean' &&
    !!o &&
    typeof o === 'object' &&
    typeof o.github === 'boolean' &&
    typeof o.google === 'boolean'
  )
}

/** What the login screen needs to know. `null` if the API does not respond —
 *  the caller then falls back to "everything is offered". Unauthenticated. */
export async function fetchAuthConfig(): Promise<AuthConfig | null> {
  try {
    const res = await fetch(`${await getApiUrl()}/auth/config`, { cache: 'no-store' })
    if (!res.ok) return null
    const body: unknown = await res.json()
    return isAuthConfig(body) ? body : null
  } catch {
    return null
  }
}

// ─── Connectors ────────────────────────────────────────────────────────────────

export interface ConnectorProvider {
  name: string
  displayName: string
  /** `auto`: adding a flux is immediate; `manual`: it goes through a request. */
  fluxApproval?: 'auto' | 'manual'
}

export async function getConnectorProviders(token: string): Promise<ConnectorProvider[]> {
  const data = await apiFetch<{ providers: ConnectorProvider[] }>('/connectors/providers', token)
  return data.providers
}

// ─── UI user feed ──────────────────────────────────────────────────────────────

export interface UserRepositoryItem {
  id: string
  repository_id: number
  created_at: string
  url: string
  provider: string
  config: Record<string, unknown>
}

export interface UserFeedResponse {
  repositories: UserRepositoryItem[]
  connectors: Record<string, ConnectorItem[]>
}

export async function getUserFeed(userId: string, token: string): Promise<UserFeedResponse> {
  return apiFetch<UserFeedResponse>(`/ui/users/${userId}/feed`, token, { cache: 'no-store' })
}

/** The API answers either `{ repository }` (flux created), or
 *  `202 { status: 'pending' }` when the provider is in `manual` mode: the
 *  request goes to the approval queue. */
export type AddRepositoryResult =
  | { repository: UserRepositoryItem; status?: undefined }
  | { status: 'pending'; request: FluxRequest }

export async function addUserRepository(
  userId: string,
  token: string,
  data: { provider: string; url: string; config: Record<string, unknown> },
): Promise<AddRepositoryResult> {
  return apiFetch<AddRepositoryResult>(`/ui/users/${userId}/repositories`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteUserRepository(
  userId: string,
  linkId: string,
  token: string,
): Promise<void> {
  await apiFetch<{ success: boolean }>(`/ui/users/${userId}/repositories/${linkId}`, token, {
    method: 'DELETE',
  })
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  name: string
  email: string
  created_at: string
}

export interface AdminRepository {
  id: number
  url: string
  type: string
  config: Record<string, unknown>
  subscriber_count: string
}

export async function adminListUsers(token: string): Promise<AdminUser[]> {
  const data = await apiFetch<{ users: AdminUser[] }>('/ui/users', token, {
    cache: 'no-store',
  })
  return data.users
}

export async function adminGetUser(userId: string, token: string): Promise<AdminUser> {
  const data = await apiFetch<{ user: AdminUser }>(`/ui/users/${userId}`, token, {
    cache: 'no-store',
  })
  return data.user
}

export async function adminDeleteUser(userId: string, token: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/ui/users/${userId}`, token, {
    method: 'DELETE',
  })
}

export interface AdminAccount {
  id: string
  email: string
  name: string
  is_super: boolean
  created_at: string
}

export async function adminListAdmins(token: string): Promise<AdminAccount[]> {
  const data = await apiFetch<{ admins: AdminAccount[] }>('/ui/admins', token, {
    cache: 'no-store',
  })
  return data.admins
}

export async function adminCreateAdmin(
  body: { email: string; name: string; password: string },
  token: string,
): Promise<{ admin: AdminAccount }> {
  return apiFetch<{ admin: AdminAccount }>('/ui/admins', token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function adminUpdateAdmin(
  id: string,
  body: { name?: string; email?: string; password?: string },
  token: string,
): Promise<void> {
  await apiFetch<{ success: boolean }>(`/ui/admins/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function adminDeleteAdmin(id: string, token: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/ui/admins/${id}`, token, {
    method: 'DELETE',
  })
}

export async function adminChangeOwnPassword(
  body: { currentPassword: string; password: string },
  token: string,
): Promise<void> {
  await apiFetch<{ success: boolean }>('/ui/admins/me', token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export interface RepositorySubscriber {
  id: string
  name: string
  email: string
  subscribed_at: string
}

export async function adminListRepositorySubscribers(
  repoId: number,
  token: string,
): Promise<RepositorySubscriber[]> {
  const data = await apiFetch<{ subscribers: RepositorySubscriber[] }>(
    `/ui/repositories/${repoId}/subscribers`,
    token,
    { cache: 'no-store' },
  )
  return data.subscribers
}

export async function adminListRepositories(token: string): Promise<AdminRepository[]> {
  const data = await apiFetch<{ repositories: AdminRepository[] }>('/ui/repositories', token, {
    cache: 'no-store',
  })
  return data.repositories
}

export async function adminDeleteRepository(repoId: number, token: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/ui/repositories/${repoId}`, token, {
    method: 'DELETE',
  })
}

export async function adminClearRepositoryData(repoId: number, token: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/ui/repositories/${repoId}/data`, token, {
    method: 'DELETE',
  })
}

// ─── Provider fluxes (list existing fluxes + subscribe) ─────────────────────

export async function getProviderFluxes(provider: string, token: string): Promise<ProviderFlux[]> {
  const data = await apiFetch<{ fluxes: ProviderFlux[] }>(`/providers/${provider}/fluxes`, token, {
    cache: 'no-store',
  })
  return data.fluxes
}

export async function subscribeFlux(provider: string, id: number, token: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/providers/${provider}/fluxes/${id}/subscribe`, token, {
    method: 'POST',
  })
}

export async function unsubscribeFlux(provider: string, id: number, token: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/providers/${provider}/fluxes/${id}/subscribe`, token, {
    method: 'DELETE',
  })
}

// ─── Admin — providers & flux requests ────────────────────────────────────────

export async function adminListProviders(
  token: string,
): Promise<{ name: string; displayName: string; flux_approval: 'auto' | 'manual' }[]> {
  const data = await apiFetch<{
    providers: { name: string; displayName: string; flux_approval: 'auto' | 'manual' }[]
  }>('/ui/providers', token, { cache: 'no-store' })
  return data.providers
}

export async function adminSetProviderApproval(
  name: string,
  flux_approval: 'auto' | 'manual',
  token: string,
): Promise<void> {
  await apiFetch<{ success: boolean }>(`/ui/providers/${name}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ flux_approval }),
  })
}

export async function adminListFluxRequests(token: string): Promise<FluxRequest[]> {
  const data = await apiFetch<{ requests: FluxRequest[] }>('/ui/flux-requests', token, {
    cache: 'no-store',
  })
  return data.requests
}

export async function adminApproveFluxRequest(
  requestId: string,
  body: { config?: Record<string, unknown> },
  token: string,
): Promise<{ repository_id: number }> {
  return apiFetch<{ repository_id: number }>(`/ui/flux-requests/${requestId}/approve`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function adminRejectFluxRequest(requestId: string, token: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/ui/flux-requests/${requestId}/reject`, token, {
    method: 'POST',
  })
}

export async function adminCreateRepository(
  body: { url: string; type: string; config: Record<string, unknown> },
  token: string,
): Promise<{ id: number }> {
  return apiFetch<{ id: number }>('/ui/repositories', token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// ─── Admin — content retention & cleanup ─────────────────────────────────────

export type RetentionProvider = {
  name: string
  displayName: string
  /** `null` = follows the global default. */
  retention_days: number | null
}

export type RetentionSettings = {
  /** `null` = purge disabled as long as no provider overrides it. */
  default: number | null
  providers: RetentionProvider[]
}

export async function adminGetRetention(token: string): Promise<RetentionSettings> {
  return apiFetch<RetentionSettings>('/ui/maintenance/retention', token, { cache: 'no-store' })
}

export async function adminUpdateRetention(
  body: { default?: number | null; providers?: Record<string, number | null> },
  token: string,
): Promise<void> {
  await apiFetch<{ success: boolean }>('/ui/maintenance/retention', token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function adminRunCleanup(
  token: string,
): Promise<{ purged: { provider: string; deleted: number }[]; total: number }> {
  return apiFetch<{ purged: { provider: string; deleted: number }[]; total: number }>(
    '/ui/maintenance/cleanup',
    token,
    { method: 'POST' },
  )
}

// ─── Admin — connector API keys ─────────────────────────────────────────────

export type ConnectorKey = {
  id: string
  provider: string
  name: string
  key_prefix: string
  created_at: string
  last_used_at: string | null
  revoked_at: string | null
}

export async function adminListConnectorKeys(token: string): Promise<ConnectorKey[]> {
  const data = await apiFetch<{ keys: ConnectorKey[] }>('/ui/connector-keys', token, {
    cache: 'no-store',
  })
  return data.keys
}

/** The plain `stayup_conn_…` secret in `key` is returned only here, once. */
export async function adminCreateConnectorKey(
  body: { provider: string; name: string },
  token: string,
): Promise<{ id: string; provider: string; name: string; key: string }> {
  return apiFetch('/ui/connector-keys', token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function adminRevokeConnectorKey(id: string, token: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/ui/connector-keys/${id}`, token, {
    method: 'DELETE',
  })
}
