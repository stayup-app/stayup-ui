// Parties de la doc qui ne se traduisent pas : SQL, commandes, noms de colonnes,
// identifiants de providers. Les garder ici évite qu'une traduction ne dérive et
// ne publie une commande qui ne marche pas.

// Ancres de sommaire, par page.
export const HOME_ANCHORS = {
  concept: 'concept',
  vocabulary: 'vocabulary',
  paths: 'paths',
} as const

export const INSTALL_ANCHORS = {
  why: 'why',
  pieces: 'pieces',
  fastPath: 'fast-path',
  walkthrough: 'walkthrough',
  requirements: 'requirements',
  databases: 'databases',
  env: 'configuration',
  deploy: 'deploy',
  schema: 'schema',
  auth: 'authentication',
  pointing: 'pointing-a-client',
  troubleshooting: 'troubleshooting',
} as const

export const ADMIN_ANCHORS = {
  webUi: 'admin-web-ui',
  roles: 'roles',
  managingAdmins: 'managing-admins',
  fluxApproval: 'flux-approval',
  usersAndFluxes: 'users-and-fluxes',
  dataSources: 'secondary-databases',
  addingFlux: 'adding-a-flux-from-the-apps',
} as const

export const PROVIDER_ANCHORS = {
  what: 'what-is-a-provider',
  access: 'where-it-writes',
  existing: 'existing-providers',
  creating: 'writing-your-own',
  templates: 'display-templates',
  form: 'the-form-descriptor',
  fluxApproval: 'flux-approval',
  contract: 'technical-contract',
} as const

export const GENERATE_ANCHORS = {
  how: 'how-it-works',
  requirements: 'requirements',
  form: 'build-your-script',
  run: 'run-it',
  after: 'after-setup',
  production: 'going-to-production',
} as const

// Un déploiement de prod, bout à bout : Neon (Postgres) + Cloudflare Workers
// (API) + GitHub Actions (planificateur des connecteurs). Commandes et YAML ici,
// prose dans chaque locale.
export const PROD_SNIPPETS = {
  neonBootstrap: `git clone https://github.com/stayup-app/stayup-api.git
cd stayup-api
npm ci

# the pooled Neon string — used by the API (connectors never touch the database)
export DATABASE_URL="postgres://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# applies src/db/schema.sql, then inserts the first SUPER admin
npm run create-admin -- root@example.com "Root" 'a-strong-password'`,

  workersSecrets: `npx wrangler login
npx wrangler secret put DATABASE_URL   # paste the pooled Neon string
npx wrangler secret put JWT_SECRET     # e.g. the output of: openssl rand -hex 32

# only if you use OAuth:
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET`,

  workersVars: `# wrangler.toml — public, non-secret config
[vars]
UI_URL = "https://your-ui.example.com"
INSTANCE_NAME = "My StayUp"
REGISTRATION_MODE = "approval"   # or "open"`,

  workersDeploy: `npx wrangler deploy
# → deployed to https://stayup-api.<your-subdomain>.workers.dev

curl https://stayup-api.<your-subdomain>.workers.dev/           # {"status":"ok"}
curl https://stayup-api.<your-subdomain>.workers.dev/auth/config`,

  connectorWorkflow: `# .github/workflows/daily.yml — already in every stayup-cmd-* repo
name: Daily RSS fetch

on:
  schedule:
    - cron: "0 6 * * *"      # every day at 06:00 UTC — tune this
  workflow_dispatch: {}       # adds a "Run workflow" button in the Actions tab

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.13"
      - run: pip install -r requirements.txt
      - run: python fetch_rss.py
        env:
          STAYUP_API_URL: \${{ secrets.STAYUP_API_URL }}
          STAYUP_API_KEY: \${{ secrets.STAYUP_API_KEY }}`,

  cronExamples: `"0 0 * * *"      every day at 00:00 UTC
"0 */6 * * *"    every 6 hours
"*/30 * * * *"   every 30 minutes
"0 8 * * 1"      Mondays at 08:00 UTC`,

  prodVerify: `# 1. API + database
curl https://stayup-api.<sub>.workers.dev/                     # {"status":"ok"}

# 2. every connector that has run at least once
curl https://stayup-api.<sub>.workers.dev/connectors/providers \\
  -H "Authorization: Bearer $TOKEN"`,
} as const

// Les moteurs pris en charge par l'API. L'ordre est celui des onglets : le plus
// courant d'abord, le NoSQL en dernier parce qu'il est le plus dépaysant.
export const ENGINES = [
  {
    id: 'postgres',
    label: 'PostgreSQL',
    schemes: 'postgres:// · postgresql://',
    driver: '—',
    schemaFile: 'src/db/schema.sql',
  },
  {
    id: 'mysql',
    label: 'MySQL / MariaDB',
    schemes: 'mysql:// · mariadb://',
    driver: 'npm install mysql2',
    schemaFile: 'src/db/schema.mysql.sql',
  },
  {
    id: 'sqlite',
    label: 'SQLite',
    schemes: 'sqlite:// · file://',
    driver: 'npm install better-sqlite3',
    schemaFile: 'src/db/schema.sqlite.sql',
  },
  {
    id: 'mongodb',
    label: 'MongoDB',
    schemes: 'mongodb:// · mongodb+srv://',
    driver: 'npm install mongodb',
    schemaFile: '—',
  },
] as const

export type EngineId = (typeof ENGINES)[number]['id']

/** Application du schéma de base, une commande par moteur. */
export const SCHEMA_COMMANDS: Record<EngineId, string> = {
  postgres: `psql "$DATABASE_URL" -f src/db/schema.sql`,
  mysql: `mysql -h <host> -u <user> -p <database> < src/db/schema.mysql.sql`,
  sqlite: `sqlite3 stayup.db < src/db/schema.sqlite.sql`,
  mongodb: `mongosh "$DATABASE_URL" --eval '
  db.repository.createIndex({ url: 1 }, { unique: true })
  db.user_repository.createIndex({ user_id: 1, repository_id: 1 }, { unique: true })
'`,
}

// ─── Le contrat HTTP d'un connecteur ─────────────────────────────────────────
// Un connecteur ne touche jamais la base : il appelle /connector-api/<name>/*,
// authentifié par une clé scopée à son seul provider. Une entrée = une ligne du
// tableau de la page providers ; l'ordre est celui d'un run.

export interface ConnectorEndpoint {
  call: string
}

export const CONNECTOR_ENDPOINTS: readonly ConnectorEndpoint[] = [
  { call: 'POST /connector-api/<name>/register' },
  { call: 'POST /connector-api/<name>/sources' },
  { call: 'GET /connector-api/<name>/sources' },
  { call: 'GET /connector-api/<name>/sources/:id/state' },
  { call: 'GET /connector-api/<name>/sources/:id/versions' },
  { call: 'PATCH /connector-api/<name>/sources/:id/config' },
  { call: 'POST /connector-api/<name>/items' },
  { call: 'DELETE /connector-api/<name>/sources/:id/old-items' },
  { call: 'POST /connector-api/<name>/errors' },
] as const

// Les champs d'une ligne envoyée dans POST /connector-api/<name>/items. Le nom
// et « requis ? » ne se traduisent pas ; la description vit dans chaque locale.
export const CONNECTOR_ITEM_FIELDS = [
  { field: 'repositoryId', required: true },
  { field: 'content', required: true },
  { field: 'executedAt', required: true },
  { field: 'success', required: true },
  { field: 'version', required: false },
  { field: 'datetime', required: false },
  { field: 'params', required: false },
] as const

export const ENV_VARS = [
  { name: 'DATABASE_URL', required: true },
  { name: 'JWT_SECRET', required: true },
  { name: 'UI_URL', required: false },
  { name: 'GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET', required: false },
  { name: 'GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET', required: false },
] as const

export const NAMING_ROWS = [
  { example: '/connector-api/podcast/…' },
  { example: "repository.type = 'podcast'" },
  { example: "provider_registry.name = 'podcast'" },
  { example: '{ "provider": "podcast" } when an app adds a flux' },
] as const

export const SNIPPETS = {
  docker: `git clone https://github.com/stayup-app/stayup-api.git
cd stayup-api
cp .env.example .env   # set DATABASE_URL and JWT_SECRET
docker compose up -d db api`,

  workers: `npm ci
npx wrangler secret put DATABASE_URL
npx wrangler secret put JWT_SECRET
# UI_URL and the OAuth vars can live in wrangler.toml`,

  node: `npm ci
npm run build
DATABASE_URL=... JWT_SECRET=... npm start`,

  createAdmin: `# bootstrap the first super admin (from source)
npm run create-admin -- root@example.com "Root" 'a-strong-password'

# or from a built image / container:
docker compose run --rm api node dist/scripts/create-admin.js \\
  root@example.com "Root" 'a-strong-password'`,

  createUser: `npm run create-user -- "Your Name" you@example.com yourpassword`,

  verify: `curl https://your-api.example.com/           # {"status":"ok"}
curl https://your-api.example.com/connectors/providers \\
  -H "Authorization: Bearer $TOKEN"                    # {"providers":[]}`,

  runConnector: `git clone https://github.com/stayup-app/stayup-cmd-rss.git
cd stayup-cmd-rss
pip install -r requirements.txt

# a connector key created for "rss" in the admin panel — never a database URL
export STAYUP_API_URL=http://localhost:3000
export STAYUP_API_KEY=stayup_conn_xxxxxxxxxxxxxxxx

python fetch_rss.py --add https://blog.example.com/feed.xml
python fetch_rss.py            # first real run: registers itself, then collects`,

  addSource: `# a connector follows a URL itself (the --add flag):
POST /connector-api/<name>/sources
{ "url": "https://blog.example.com/feed.xml" }

# a user adds one from an app — routed through auto/manual approval:
POST /ui/users/<userId>/repositories
{ "provider": "<name>", "url": "https://blog.example.com/feed.xml", "config": {} }`,
} as const

export const CHECKLIST_CODE = [
  'POST /connector-api/<name>/register',
  'GET /connector-api/<name>/sources',
  'POST /connector-api/<name>/items',
  'GET /connector-api/<name>/sources/:id/state',
  'DELETE /connector-api/<name>/sources/:id/old-items',
  'POST /connector-api/<name>/errors',
  'GET /connectors/providers',
] as const
