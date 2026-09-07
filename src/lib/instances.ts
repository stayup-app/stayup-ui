import { cookies } from 'next/headers'
import { COOKIE_NAME } from './constants'
import { API_URL_COOKIE, DEFAULT_API_URL } from './apiUrl'

/** An API instance tracked by this browser. `instances[0]` is the primary: it
 *  is the first login, it cannot be removed without a full logout, and it is the
 *  default target for a new flux. Secondary ones are added / renamed / removed
 *  freely. */
export interface Instance {
  id: string
  url: string
  name: string
  token: string
}

export const INSTANCES_COOKIE = 'stayup_instances'
const CHUNK_PREFIX = 'stayup_instances_'
// Below the ~4 KB per-cookie limit: beyond it we split into `..._0`, `..._1`…
const MAX_COOKIE_BYTES = 3500

export function hostOf(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

export function newInstanceId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ?? `i_${Date.now()}_${Math.random().toString(36).slice(2)}`
  )
}

type CookieStore = Awaited<ReturnType<typeof cookies>>

function readRaw(store: CookieStore): string | null {
  const single = store.get(INSTANCES_COOKIE)?.value
  if (single) return single
  const chunks: string[] = []
  for (let i = 0; ; i++) {
    const c = store.get(`${CHUNK_PREFIX}${i}`)?.value
    if (c === undefined) break
    chunks.push(c)
  }
  return chunks.length ? chunks.join('') : null
}

function parseList(raw: string): Instance[] | null {
  try {
    const list = JSON.parse(raw) as unknown
    if (!Array.isArray(list)) return null
    const ok = list.every(
      (i) =>
        i &&
        typeof i === 'object' &&
        typeof (i as Instance).id === 'string' &&
        typeof (i as Instance).url === 'string' &&
        typeof (i as Instance).name === 'string' &&
        typeof (i as Instance).token === 'string',
    )
    return ok ? (list as Instance[]) : null
  } catch {
    return null
  }
}

/** Ordered list of instances. Read-only: a Server Component cannot write a
 *  cookie, so the migration from the legacy keys (`stayup_token` +
 *  `stayup_api_url`) is computed in memory; the legacy keys are cleaned up on
 *  the first mutation (see `writeInstances`). */
export async function readInstances(): Promise<Instance[]> {
  const store = await cookies()
  const raw = readRaw(store)
  if (raw) {
    const list = parseList(raw)
    if (list && list.length) return list
  }

  const legacyToken = store.get(COOKIE_NAME)?.value
  if (legacyToken) {
    const url = store.get(API_URL_COOKIE)?.value?.replace(/\/$/, '') || DEFAULT_API_URL
    return [{ id: 'primary', url, name: hostOf(url), token: legacyToken }]
  }
  return []
}

export async function primaryInstance(): Promise<Instance | null> {
  return (await readInstances())[0] ?? null
}

/** Resolves the instance a request targets: the one whose id is passed,
 *  otherwise the primary. `null` if the id is unknown or there is no instance. */
export async function resolveInstance(instanceId?: string | null): Promise<Instance | null> {
  const list = await readInstances()
  if (!instanceId) return list[0] ?? null
  return list.find((i) => i.id === instanceId) ?? null
}

function tokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()) as {
      exp?: number
    }
    return payload.exp ?? 0
  } catch {
    return 0
  }
}

/** Writes the list to the cookies (chunked if needed) and purges the legacy
 *  keys. Only call from a server action or a route handler. The cookie's
 *  lifetime follows the latest-expiring token. */
export async function writeInstances(list: Instance[]): Promise<void> {
  const store = await cookies()
  const json = JSON.stringify(list)
  const maxExp = list.reduce((m, i) => Math.max(m, tokenExpiry(i.token)), 0)
  const maxAge = Math.max(maxExp - Math.floor(Date.now() / 1000), 0)
  const opts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge,
  }

  // Start from a clean slate: avoids a leftover chunk from a larger write.
  store.delete(INSTANCES_COOKIE)
  for (let i = 0; i < 12; i++) store.delete(`${CHUNK_PREFIX}${i}`)

  if (Buffer.byteLength(json) <= MAX_COOKIE_BYTES) {
    store.set(INSTANCES_COOKIE, json, opts)
  } else {
    for (let i = 0, o = 0; o < json.length; i++, o += MAX_COOKIE_BYTES) {
      store.set(`${CHUNK_PREFIX}${i}`, json.slice(o, o + MAX_COOKIE_BYTES), opts)
    }
  }

  // Legacy keys now redundant.
  store.delete(COOKIE_NAME)
  store.delete(API_URL_COOKIE)
}

export async function clearInstances(): Promise<void> {
  const store = await cookies()
  store.delete(INSTANCES_COOKIE)
  for (let i = 0; i < 12; i++) store.delete(`${CHUNK_PREFIX}${i}`)
  store.delete(COOKIE_NAME)
  store.delete(API_URL_COOKIE)
}

/** Sets or refreshes the primary from a fresh token (login / register / OAuth).
 *  Keeps the secondary instances already present. */
export async function upsertPrimaryInstance(url: string, token: string): Promise<void> {
  const clean = url.replace(/\/$/, '')
  const rest = (await readInstances()).slice(1)
  const prev = (await readInstances())[0]
  await writeInstances([
    { id: prev?.id ?? 'primary', url: clean, name: prev?.name ?? hostOf(clean), token },
    ...rest,
  ])
}

export async function addInstanceEntry(entry: Omit<Instance, 'id'>): Promise<void> {
  const list = await readInstances()
  await writeInstances([...list, { ...entry, id: newInstanceId() }])
}

export async function removeInstanceEntry(id: string): Promise<'cleared' | 'removed'> {
  const list = await readInstances()
  if (list[0]?.id === id) {
    await clearInstances()
    return 'cleared'
  }
  await writeInstances(list.filter((i) => i.id !== id))
  return 'removed'
}

export async function renameInstanceEntry(id: string, name: string): Promise<void> {
  const list = await readInstances()
  await writeInstances(list.map((i) => (i.id === id ? { ...i, name } : i)))
}

export async function setPrimaryInstanceEntry(id: string): Promise<void> {
  const list = await readInstances()
  const target = list.find((i) => i.id === id)
  if (!target) return
  await writeInstances([target, ...list.filter((i) => i.id !== id)])
}

export async function updateInstanceTokenEntry(id: string, token: string): Promise<void> {
  const list = await readInstances()
  await writeInstances(list.map((i) => (i.id === id ? { ...i, token } : i)))
}
