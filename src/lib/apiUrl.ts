import { cookies } from 'next/headers'

export const API_URL_COOKIE = 'stayup_api_url'

// This deployment's default API URL (env var set at build/deploy time).
export const DEFAULT_API_URL = process.env.STAYUP_API_URL?.replace(/\/$/, '') ?? ''

/** The API URL to use for the current request: the override the visitor set
 *  (cookie, adjustable from /profile) if present, otherwise this deployment's
 *  default URL. */
export async function getApiUrl(): Promise<string> {
  const cookieStore = await cookies()
  const override = cookieStore.get(API_URL_COOKIE)?.value?.replace(/\/$/, '')
  return override || DEFAULT_API_URL
}
