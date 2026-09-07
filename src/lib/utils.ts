import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** A flux's short label: the scheme stripped. The rich per-provider label now
 *  comes from the template's `display.feedLabel` (see resolveFeedLabel). */
export function extractIdentifier(url: string): string {
  return stripUrlScheme(url)
}

export function stripUrlScheme(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/^www\./, '')
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

/** Fallback label for a provider with no translation known to the app (same
 *  rules as the API-side displayName fallback — see
 *  stayup-api/src/db/providerRegistry.ts). */
export function providerDisplayName(provider: string): string {
  return provider.charAt(0).toUpperCase() + provider.slice(1)
}
