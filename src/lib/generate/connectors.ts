/**
 * Catalog of the official connectors and repos used by the self-hosted project
 * generator (see `buildScript.ts`). Nothing to translate here: these are
 * identifiers and URLs.
 */

export type ConnectorId = 'changelog' | 'youtube' | 'rss' | 'scrap' | 'github-trending'

export interface OfficialConnector {
  id: ConnectorId
  /** Repo GitHub `owner/name`. */
  repo: string
  /** Default Ofelia schedule, offered in the script's prompt. */
  defaultCron: string
}

/** Crons taken from each `stayup-cmd-*`'s `daily.yml` workflow. */
export const OFFICIAL_CONNECTORS: readonly OfficialConnector[] = [
  { id: 'changelog', repo: 'stayup-app/stayup-cmd-changelog', defaultCron: '0 0 * * *' },
  { id: 'youtube', repo: 'stayup-app/stayup-cmd-youtube', defaultCron: '0 20 * * *' },
  { id: 'rss', repo: 'stayup-app/stayup-cmd-rss', defaultCron: '0 0 * * *' },
  { id: 'scrap', repo: 'stayup-app/stayup-cmd-scrap', defaultCron: '0 0 * * *' },
  {
    id: 'github-trending',
    repo: 'stayup-app/stayup-cmd-github-trending',
    defaultCron: '0 0 * * *',
  },
] as const

export const API_REPO = 'stayup-app/stayup-api'
export const UI_REPO = 'stayup-app/stayup-ui'

export const CONNECTOR_IDS = OFFICIAL_CONNECTORS.map((c) => c.id)

export type DbEngine = 'postgres' | 'mysql' | 'sqlite' | 'mongodb'

/** Only Postgres is wired in v1: the 5 connectors are psycopg2 + PG SQL. */
export const SUPPORTED_DB_ENGINES: readonly DbEngine[] = ['postgres'] as const
