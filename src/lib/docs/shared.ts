// Parts of the docs that are not translated: SQL, commands, column names,
// provider identifiers. Keeping them here prevents a translation from drifting
// and publishing a command that does not work.

// Table-of-contents anchors, per page.
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

export const TUTORIAL_ANCHORS = {
  intro: 'what-you-are-building',
  prereqs: 'before-you-start',
  steps: 'the-steps',
  run: 'run-it',
  schedule: 'on-a-schedule',
  full: 'the-whole-file',
  next: 'from-here',
} as const

// An end-to-end prod deployment: Neon (Postgres) + Cloudflare Workers (API) +
// GitHub Actions (the connectors' scheduler). Commands and YAML here, prose in
// each locale.
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

// The engines the API supports. The order is that of the tabs: the most common
// first, NoSQL last because it is the most unfamiliar.
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

/** Applying the base schema, one command per engine. */
export const SCHEMA_COMMANDS: Record<EngineId, string> = {
  postgres: `psql "$DATABASE_URL" -f src/db/schema.sql`,
  mysql: `mysql -h <host> -u <user> -p <database> < src/db/schema.mysql.sql`,
  sqlite: `sqlite3 stayup.db < src/db/schema.sqlite.sql`,
  mongodb: `mongosh "$DATABASE_URL" --eval '
  db.repository.createIndex({ url: 1 }, { unique: true })
  db.user_repository.createIndex({ user_id: 1, repository_id: 1 }, { unique: true })
'`,
}

// ─── A connector's HTTP contract ────────────────────────────────────────────
// A connector never touches the database: it calls /connector-api/<name>/*,
// authenticated by a key scoped to its single provider. One entry = one row of
// the providers page table; the order is that of a run.

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
  { call: 'POST /connector-api/<name>/errors' },
] as const

// The fields of a row sent in POST /connector-api/<name>/items. The name and
// "required?" are not translated; the description lives in each locale.
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
  'POST /connector-api/<name>/errors',
  'GET /connectors/providers',
] as const

// ─── /docs/providers/tutorial — a Hacker News connector, from scratch ────────
// A real connector, short, with no external API key: each tracked source is an
// HN list endpoint (topstories.json, beststories.json…), the collector reads
// its stories and sends the new ones to stayup-api. The code is not translated;
// the prose of each step lives in the locales (`tutorial.steps.*`).

export const TUTORIAL = {
  head: `#!/usr/bin/env python3
"""StayUp connector — Hacker News.

Each tracked source is a Hacker News "list" endpoint (topstories.json,
beststories.json, newstories.json…). On every run the connector reads the
list, fetches the newest stories it has not stored yet, and sends them to
stayup-api. It never touches a database.
"""
from __future__ import annotations
`,

  setup: `mkdir stayup-cmd-hackernews && cd stayup-cmd-hackernews
python -m venv .venv && . .venv/bin/activate
pip install requests
# the instance you report to + a connector key for "hackernews",
# created in the admin panel (Connector keys → New key, provider hackernews)
export STAYUP_API_URL=http://localhost:3000
export STAYUP_API_KEY=stayup_conn_xxxxxxxxxxxxxxxx`,

  helper: `import argparse, json, os, sys
from datetime import datetime, timezone
import requests

PROVIDER = "hackernews"
API_URL = os.environ.get("STAYUP_API_URL", "http://localhost:3000").rstrip("/")
API_KEY = os.environ.get("STAYUP_API_KEY")
HN = "https://hacker-news.firebaseio.com/v0"
STORIES_PER_RUN = 15


def api(method, path, **kwargs):
    """Call stayup-api's /connector-api/hackernews/* — Bearer-authenticated."""
    if not API_KEY:
        sys.exit("STAYUP_API_KEY is not set.")
    r = requests.request(
        method, f"{API_URL}/connector-api/{PROVIDER}{path}",
        headers={"Authorization": f"Bearer {API_KEY}"}, timeout=30, **kwargs,
    )
    r.raise_for_status()
    return r.json() if r.content else None`,

  template: `# How the web / desktop / mobile apps render this connector's rows.
# stayup-api stores it and relays it untouched — it never reads it.
DISPLAY_NAME = "Hacker News"
SORT_ORDER = 60

TEMPLATE = {
    "version": 1,
    "display": {
        "name": DISPLAY_NAME,
        "accent": "#ff6600",
        "sortOrder": SORT_ORDER,
        "feedLabel": [{"path": "$source.url", "format": "domain"}],
    },
    "item": {
        "parseContentAsJson": True,
        "fields": {"title": "title", "subtitle": "by", "url": "url",
                   "timestamp": "$row.datetime"},
    },
    "list": {"layout": "row", "primary": "title", "secondary": "subtitle",
             "meta": "timestamp"},
    "detail": {"mode": "text", "title": "title", "subtitle": "by",
               "openUrl": "url", "openLabel": "Open on Hacker News"},
    "form": {
        "label": "Hacker News list endpoint",
        "placeholder": HN + "/topstories.json",
        "pattern": r"^https://hacker-news\\.firebaseio\\.com/v0/[a-z]+stories\\.json$",
        "transform": {"trim": True},
    },
}


def register():
    api("POST", "/register",
        json={"displayName": DISPLAY_NAME, "sortOrder": SORT_ORDER, "template": TEMPLATE})`,

  fetch: `def fetch_stories(list_url):
    """The newest stories of one HN list, newest first, ready for /items."""
    ids = requests.get(list_url, timeout=30).json()[:STORIES_PER_RUN]
    rows = []
    for story_id in ids:
        story = requests.get(f"{HN}/item/{story_id}.json", timeout=30).json()
        if not story or story.get("type") != "story" or not story.get("title"):
            continue
        rows.append({
            "version": str(story["id"]),                       # dedupe key
            "content": json.dumps({
                "title": story["title"],
                "url": story.get("url")
                       or f"https://news.ycombinator.com/item?id={story['id']}",
                "by": story.get("by", ""),
            }, ensure_ascii=False),
            "datetime": datetime.fromtimestamp(story["time"], tz=timezone.utc).isoformat(),
        })
    return rows`,

  collect: `def collect():
    now = datetime.now(tz=timezone.utc).isoformat()
    sources = api("GET", "/sources")["sources"]
    if not sources:
        print("No list tracked yet. Run with --add <HN list endpoint>.")
        return

    for source in sources:
        try:
            # every id already stored for this source → skip those
            known = set(api("GET", f"/sources/{source['id']}/versions")["versions"])
            new_rows = [r for r in fetch_stories(source["url"])
                        if r["version"] not in known]
            if new_rows:
                api("POST", "/items", json={"items": [
                    {**r, "repositoryId": source["id"], "executedAt": now, "success": True}
                    for r in new_rows
                ]})
                print(f"[{source['url']}] +{len(new_rows)}")
        except Exception as exc:
            api("POST", "/errors", json={
                "repositoryId": source["id"], "error": str(exc), "executedAt": now})
            print(f"[{source['url']}] {exc}", file=sys.stderr)`,

  main: `def main():
    parser = argparse.ArgumentParser(description="StayUp — Hacker News connector.")
    parser.add_argument("--add", metavar="URL", help="Track a HN list endpoint and exit.")
    args = parser.parse_args()

    register()  # idempotent — safe to call on every run

    if args.add:
        source = api("POST", "/sources", json={"url": args.add})
        print(f"Tracking {source['url']} (source #{source['id']}).")
        return

    collect()


if __name__ == "__main__":
    main()`,

  run: `python check_hn.py --add https://hacker-news.firebaseio.com/v0/topstories.json
python check_hn.py --add https://hacker-news.firebaseio.com/v0/beststories.json
python check_hn.py            # first real run: registers, then collects

# it now shows up:
curl -s "$STAYUP_API_URL/connectors/providers" -H "Authorization: Bearer <user JWT>"`,

  workflow: `# .github/workflows/daily.yml
name: Hacker News
on:
  schedule:
    - cron: "17 */2 * * *"     # every 2 hours, offset so it isn't on the hour
  workflow_dispatch: {}

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.13"
      - run: pip install requests
      - run: python check_hn.py
        env:
          STAYUP_API_URL: \${{ secrets.STAYUP_API_URL }}
          STAYUP_API_KEY: \${{ secrets.STAYUP_API_KEY }}`,
} as const
