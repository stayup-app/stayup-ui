/**
 * Self-hosted install script generator.
 *
 * `buildSetupScript(input)` returns a single `stayup-setup.sh`. The script is
 * *fully static*: the `docker-compose.yml` and the `ofelia.ini` are written
 * block by block (one per chosen connector), not built by runtime loops. The
 * only interactivity is the prompt (super admin credentials + each cron's
 * frequency); the crons feed `CRON_<name>` variables pre-filled with their
 * default.
 *
 * Pure, deterministic function (covered by snapshot). Output = bash/YAML/INI
 * for technical use — nothing to translate.
 *
 * Escaping (body in a template literal): `$VAR`, `$1`, `$(cmd)` pass through
 * as-is; a literal bash `${...}` must be written `\${...}`; `\\n` / `\\033`
 * for `printf` sequences.
 */

import {
  API_REPO,
  CONNECTOR_IDS,
  type ConnectorId,
  OFFICIAL_CONNECTORS,
  UI_REPO,
} from './connectors'

export interface CustomConnector {
  /** URL clonable (https:// ou git@). */
  gitUrl: string
  /** Service name; derived from the repo if empty. */
  serviceName?: string
}

export type RegistrationMode = 'open' | 'approval'

export interface GeneratorInput {
  projectDir: string
  connectors: ConnectorId[]
  customConnectors: CustomConnector[]
  includeAdminUi: boolean
  /** `open`: signing up activates the account right away. `approval`: the
   *  account waits for an admin to approve it. */
  registrationMode: RegistrationMode
  /** OAuth providers to enable. The script will ask for the client id/secret
   *  at runtime — they are never written into the script itself. */
  oauth: { google: boolean; github: boolean }
  ports: { api: number; ui: number; db: number }
}

export const DEFAULT_INPUT: GeneratorInput = {
  projectDir: 'stayup',
  connectors: [...CONNECTOR_IDS],
  customConnectors: [],
  includeAdminUi: true,
  registrationMode: 'open',
  oauth: { google: false, github: false },
  ports: { api: 3000, ui: 3001, db: 5432 },
}

const NAME_RE = /^[a-z0-9][a-z0-9-]*$/
/** Suffixe de variable shell : `-` interdit. */
const cronVar = (name: string) => `CRON_${name.replace(/-/g, '_')}`

/** `https://github.com/me/My_Connector.git` → `my-connector`. */
export function deriveServiceName(gitUrl: string): string {
  const tail =
    gitUrl
      .trim()
      .replace(/\.git$/, '')
      .replace(/\/+$/, '')
      .split(/[/:]/)
      .pop() ?? ''
  const slug = tail
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'connector'
}

interface ResolvedConnector {
  name: string
  /** The provider name as the collector uses it in `/connector-api/<provider>/*`
   *  and in `provider_registry` — this is what the connector key is scoped to.
   *  Derived from the service name by turning `-` back into `_` (e.g.
   *  `github-trending` → `github_trending`). For a custom connector, assumes its
   *  `PROVIDER_TYPE` follows the same rule. */
  provider: string
  gitUrl: string
  cron: string
}

function resolveConnectors(input: GeneratorInput): ResolvedConnector[] {
  const official = input.connectors.map((id) => {
    const c = OFFICIAL_CONNECTORS.find((o) => o.id === id)
    if (!c) throw new Error(`Unknown connector: ${id}`)
    return {
      name: c.id,
      provider: c.id.replace(/-/g, '_'),
      gitUrl: `https://github.com/${c.repo}.git`,
      cron: c.defaultCron,
    }
  })

  const seen = new Set<string>(official.map((c) => c.name))
  const custom = input.customConnectors.map((c) => {
    const url = c.gitUrl.trim()
    if (!/^(https?:\/\/|git@)/.test(url)) throw new Error(`Invalid connector URL: ${c.gitUrl}`)
    const wanted = (c.serviceName?.trim() || deriveServiceName(url)).toLowerCase()
    if (!NAME_RE.test(wanted)) throw new Error(`Invalid connector name: ${wanted}`)
    let name = wanted
    let i = 2
    while (seen.has(name)) name = `${wanted}-${i++}`
    seen.add(name)
    return { name, provider: name.replace(/-/g, '_'), gitUrl: url, cron: '0 0 * * *' }
  })

  return [...official, ...custom]
}

function validate(input: GeneratorInput): void {
  if (!NAME_RE.test(input.projectDir)) {
    throw new Error(`Invalid project directory: ${input.projectDir}`)
  }
  for (const [key, port] of Object.entries(input.ports)) {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid ${key} port: ${port}`)
    }
  }
}

function composeConnectorBlock(c: ResolvedConnector, projectDir: string): string {
  // The connector no longer touches the database: it talks to the API. The key
  // is interpolated by Compose from `.env` (`_KEY_<provider>=…`, written by the
  // script once the API is up — see the "connector keys" section).
  return `
  connector-${c.name}:
    build: ./connector-${c.name}
    image: ${projectDir}-connector-${c.name}
    environment:
      STAYUP_API_URL: http://api:3000
      STAYUP_API_KEY: \\\${_KEY_${c.provider}:-}
    depends_on:
      - api
    restart: "no"
    profiles: ["connectors"]`
}

function ofeliaBlock(c: ResolvedConnector, projectDir: string): string {
  // `$_KEY_<provider>` is expanded by the shell when the script writes
  // ofelia.ini — so after the keys have been issued.
  return `[job-run "stayup-${c.name}"]
schedule = $${cronVar(c.name)}
image = ${projectDir}-connector-${c.name}
network = ${projectDir}_default
environment = STAYUP_API_URL=http://api:3000
environment = STAYUP_API_KEY=$_KEY_${c.provider}
delete = true
`
}

/** Prompt block for an OAuth provider (client id + secret at runtime). */
function oauthPrompt(provider: 'google' | 'github', apiPort: number): string {
  const label = provider === 'google' ? 'Google' : 'GitHub'
  const where =
    provider === 'google'
      ? 'https://console.cloud.google.com/apis/credentials'
      : 'https://github.com/settings/developers'
  const idVar = `${provider.toUpperCase()}_CLIENT_ID`
  const secretVar = `${provider.toUpperCase()}_CLIENT_SECRET`
  return `c_info "${label} sign-in — create an OAuth client at ${where}"
c_info "  Callback URL:  http://localhost:${apiPort}/auth/oauth/${provider}/callback"
read -rp "  ${label} client ID:     " ${idVar}
read -rsp "  ${label} client secret: " ${secretVar}; echo`
}

export function buildSetupScript(input: GeneratorInput): string {
  validate(input)
  const connectors = resolveConnectors(input)
  const { projectDir, includeAdminUi, registrationMode, oauth, ports } = input

  const cloneLines = [
    `clone "https://github.com/${API_REPO}.git" "stayup-api"`,
    includeAdminUi ? `clone "https://github.com/${UI_REPO}.git" "stayup-ui"` : null,
    ...connectors.map((c) => `clone "${c.gitUrl}" "connector-${c.name}"`),
  ]
    .filter(Boolean)
    .join('\n')

  const cronDefaults =
    connectors.map((c) => `${cronVar(c.name)}="${c.cron}"`).join('\n') ||
    '# (no connector selected)'
  const cronPrompts = connectors
    .map((c) => {
      const v = cronVar(c.name)
      return `read -rp "Cron for '${c.name}' [$${v}]: " _v; ${v}="\${_v:-$${v}}"`
    })
    .join('\n')

  const uiService = includeAdminUi
    ? `
  ui:
    build:
      context: ./stayup-ui
      target: runner
    environment:
      STAYUP_API_URL: http://api:3000
      PORT: "3001"
    ports:
      - "${ports.ui}:3001"
    depends_on:
      - api
    restart: unless-stopped
`
    : ''

  const connectorServices = connectors.map((c) => composeConnectorBlock(c, projectDir)).join('\n')

  const ofeliaJobs = connectors.map((c) => ofeliaBlock(c, projectDir)).join('\n')

  const firstRuns =
    connectors
      .map(
        (c) =>
          `docker compose run --rm -T "connector-${c.name}" || c_err "connector-${c.name} first run failed — continuing"`,
      )
      .join('\n') || ': # no connector selected'

  // Each collector authenticates against the API with a connector key scoped
  // to its provider — no more direct database access. We issue them here, once
  // the API is up: super admin login then POST /ui/connector-keys via `node` in
  // the api container (fetch + JSON.stringify handle arbitrary credentials
  // cleanly, without depending on curl/jq on the host). The secrets
  // `_KEY_<provider>=…` land in `.env` (read by Compose for the connector-*
  // services) and as shell variables (for the ofelia.ini heredoc).
  const keyIssueNode = `const base = "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  let ready = false;
  for (let i = 0; i < 60 && !ready; i++) {
    try { const h = await fetch(base + "/"); ready = h.ok; } catch (e) {}
    if (!ready) await sleep(1000);
  }
  if (!ready) { console.error("API not reachable on " + base); process.exit(1); }
  const login = await fetch(base + "/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }),
  });
  if (!login.ok) { console.error("super admin login failed: HTTP " + login.status); process.exit(1); }
  const token = (await login.json()).token;
  for (const p of (process.env.PROVIDERS || "").split(" ").filter(Boolean)) {
    const res = await fetch(base + "/ui/connector-keys", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + token },
      body: JSON.stringify({ provider: p, name: p + " (stayup-setup.sh)" }),
    });
    if (!res.ok) { console.error("connector key failed for " + p + ": HTTP " + res.status); process.exit(1); }
    console.log("_KEY_" + p + "=" + (await res.json()).key);
  }
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exit(1); });`

  const keyIssuance =
    connectors.length === 0
      ? ': # no connector selected — no keys to issue'
      : `c_info "Issuing one connector key per provider…"
KEYS_ENV="$(docker compose exec -T \\
  -e ADMIN_EMAIL="$ADMIN_EMAIL" -e ADMIN_PASSWORD="$ADMIN_PASSWORD" \\
  -e PROVIDERS="${connectors.map((c) => c.provider).join(' ')}" \\
  api node -e '${keyIssueNode}')"
[ -n "$KEYS_ENV" ] || die "Could not issue connector keys — is the API up and the super admin valid?"
printf '%s\\n' "$KEYS_ENV" >> .env
while IFS='=' read -r _n _v; do [ -n "$_n" ] && printf -v "$_n" '%s' "$_v"; done <<< "$KEYS_ENV"
c_ok "Connector keys issued (one per provider)"`

  const uiStart = includeAdminUi ? 'c_info "Starting the admin UI…"; docker compose up -d ui\n' : ''
  const uiUrlLine = includeAdminUi
    ? 'echo "  Admin  http://localhost:$UI_PORT/admin  (log in with the super admin above)"\n'
    : ''

  const oauthPrompts = [
    oauth.google ? oauthPrompt('google', ports.api) : null,
    oauth.github ? oauthPrompt('github', ports.api) : null,
  ]
    .filter(Boolean)
    .join('\n')

  const oauthEnvLines = `      GOOGLE_CLIENT_ID: "$GOOGLE_CLIENT_ID"
      GOOGLE_CLIENT_SECRET: "$GOOGLE_CLIENT_SECRET"
      GITHUB_CLIENT_ID: "$GITHUB_CLIENT_ID"
      GITHUB_CLIENT_SECRET: "$GITHUB_CLIENT_SECRET"`

  const oauthDoneNote =
    oauth.google || oauth.github
      ? `echo "  OAuth: keep these callback URLs registered with your provider(s):"\n${[
          oauth.google
            ? `echo "    http://localhost:$API_PORT/auth/oauth/google/callback   (Google)"`
            : null,
          oauth.github
            ? `echo "    http://localhost:$API_PORT/auth/oauth/github/callback   (GitHub)"`
            : null,
        ]
          .filter(Boolean)
          .join('\n')}\n`
      : ''

  const approvalDoneNote =
    registrationMode === 'approval'
      ? 'echo "  Sign-ups wait for an admin under /admin/users → Comptes en attente (approval mode)."\n'
      : ''

  const customKeyNote =
    input.customConnectors.length > 0
      ? `echo "  Custom connectors: the issued key is scoped to the service name; if a"\necho "  connector's PROVIDER_TYPE differs, revoke it and create the right key in /admin."\n`
      : ''

  return `#!/usr/bin/env bash
#
# StayUp — self-hosted setup (generated).
# PostgreSQL + the API + the connectors you picked${includeAdminUi ? ' + the admin UI' : ''}.
# Creates the super admin, issues one connector key per provider, runs each
# connector once, then starts the scheduler.
#
# Requires: Docker, Docker Compose v2, git. Linux / macOS / WSL only.
#
set -euo pipefail

PROJECT_DIR="${projectDir}"
API_PORT="${ports.api}"
UI_PORT="${ports.ui}"

c_ok()   { printf '\\033[32m✓\\033[0m %s\\n' "$1"; }
c_info() { printf '\\033[36m•\\033[0m %s\\n' "$1"; }
c_err()  { printf '\\033[31m✗\\033[0m %s\\n' "$1" >&2; }
die()    { c_err "$1"; exit 1; }
rand_hex() {
  if command -v openssl >/dev/null 2>&1; then openssl rand -hex "$1"
  else head -c "$1" /dev/urandom | od -An -tx1 | tr -d ' \\n'; fi
}

command -v docker >/dev/null 2>&1 || die "Docker is required — https://docs.docker.com/get-docker/"
docker compose version >/dev/null 2>&1 || die "Docker Compose v2 is required ('docker compose')."
command -v git >/dev/null 2>&1 || die "git is required."
case "$(uname -s)" in
  Linux|Darwin) ;;
  *) die "This script targets Linux and macOS. On Windows, run it inside WSL." ;;
esac

# ─── Prompts ────────────────────────────────────────────────────────────────
c_info "Super admin account (manages providers and flux approvals)"
read -rp "  Email: " ADMIN_EMAIL; [ -n "$ADMIN_EMAIL" ] || die "Email is required."
read -rp "  Name:  " ADMIN_NAME;  [ -n "$ADMIN_NAME" ]  || die "Name is required."
while :; do
  read -rsp "  Password: " ADMIN_PASSWORD; echo
  read -rsp "  Confirm:  " ADMIN_PASSWORD2; echo
  [ -n "$ADMIN_PASSWORD" ] && [ "$ADMIN_PASSWORD" = "$ADMIN_PASSWORD2" ] && break
  c_err "Passwords empty or mismatched — try again."
done

# OAuth credentials are asked here and only ever land in docker-compose.yml —
# never in this script. Empty = that provider stays off.
GOOGLE_CLIENT_ID=""; GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""; GITHUB_CLIENT_SECRET=""
${oauthPrompts}

${cronDefaults}
${cronPrompts}

# ─── Scaffold ───────────────────────────────────────────────────────────────
mkdir -p "$PROJECT_DIR" && cd "$PROJECT_DIR"
clone() {
  if [ -d "$2/.git" ]; then c_info "$2 already cloned — skipping"
  else git clone --depth 1 "$1" "$2"; fi
}
${cloneLines}

POSTGRES_PASSWORD="$(rand_hex 16)"
JWT_SECRET="$(rand_hex 32)"
DATABASE_URL="postgres://stayup:$POSTGRES_PASSWORD@db:5432/stayup"

cat > .env <<EOF
# Written by stayup-setup.sh. Compose reads the _KEY_* lines (appended later)
# for the connector-* services; the rest mirrors docker-compose.yml.
POSTGRES_DB=stayup
POSTGRES_USER=stayup
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
JWT_SECRET=$JWT_SECRET
REGISTRATION_MODE=${registrationMode}
EOF

cat > docker-compose.yml <<EOF
name: ${projectDir}

services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: stayup
      POSTGRES_USER: stayup
      POSTGRES_PASSWORD: $POSTGRES_PASSWORD
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "${ports.db}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U stayup"]
      interval: 5s
      timeout: 5s
      retries: 10

  api:
    build: ./stayup-api
    environment:
      DATABASE_URL: $DATABASE_URL
      JWT_SECRET: $JWT_SECRET
      PORT: "3000"
      REGISTRATION_MODE: ${registrationMode}
      UI_URL: http://localhost:${ports.ui}
${oauthEnvLines}
    ports:
      - "${ports.api}:3000"
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
${uiService}${connectorServices}

  scheduler:
    image: mcuadros/ofelia:latest
    command: daemon --config=/etc/ofelia/config.ini
    volumes:
      - ./ofelia.ini:/etc/ofelia/config.ini:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    depends_on:
      - db
    restart: unless-stopped

volumes:
  pgdata:
EOF

# ─── Build & bring up ──────────────────────────────────────────────────────
c_info "Building the API${includeAdminUi ? ' and admin UI' : ''} image — the first build can take a few minutes…"
docker compose build api${includeAdminUi ? ' ui' : ''}

c_info "Starting PostgreSQL…"
docker compose up -d db
until docker compose exec -T db pg_isready -U stayup >/dev/null 2>&1; do sleep 2; done
c_ok "Database ready"

c_info "Applying the schema and creating the super admin…"
docker compose run --rm -T \\
  -e ADMIN_EMAIL="$ADMIN_EMAIL" -e ADMIN_NAME="$ADMIN_NAME" -e ADMIN_PASSWORD="$ADMIN_PASSWORD" \\
  api node dist/scripts/create-admin.js
c_ok "Super admin ready"

c_info "Starting the API…"
docker compose up -d api
${uiStart}
# ─── Connector keys ───────────────────────────────────────────────────────────
${keyIssuance}

cat > ofelia.ini <<EOF
${ofeliaJobs}EOF

c_info "Building the connector image(s)…"
docker compose --profile connectors build

c_info "First run of each connector (registers its provider)…"
${firstRuns}

c_info "Starting the scheduler…"
docker compose up -d scheduler

# ─── Done ──────────────────────────────────────────────────────────────────
c_ok "StayUp is up."
echo
echo "  API    http://localhost:$API_PORT/docs"
${uiUrlLine}${oauthDoneNote}${approvalDoneNote}${customKeyNote}cat <<EOF

  • Point your StayUp desktop / mobile app's API URL at  http://localhost:${ports.api}
  • Add feeds from the app — every provider offers an existing-flux list and an add-a-new-one form.
  • Logs:    docker compose logs -f
  • Stop:    docker compose stop
  • Remove:  docker compose --profile connectors down -v   (deletes the database volume)

Note: the scheduler mounts the Docker socket to launch connector containers on
schedule — root-equivalent on this host, fine for a local dev instance.
EOF
`
}
