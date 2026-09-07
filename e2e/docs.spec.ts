import { test, expect } from '@playwright/test'

// La configuration Playwright épingle le cookie de langue sur le français.

test.describe('Documentation index', () => {
  test('opens on the concept, not on implementation details', async ({ page }) => {
    await page.goto('/docs')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    // Le reproche fait à l'ancienne page : elle ouvrait sur du SQL.
    await expect(page.getByText('CREATE TABLE')).toHaveCount(0)
    await expect(page.getByText('connector_')).toHaveCount(0)
  })

  test('routes to each journey', async ({ page }) => {
    const journeys: [string, string][] = [
      ['Monter ta propre instance', '/docs/install'],
      ['Générer un script', '/docs/generate'],
      ['Exploiter ton instance', '/docs/admin'],
      ['Brancher une nouvelle source', '/docs/providers'],
    ]
    for (const [title, url] of journeys) {
      await page.goto('/docs')
      await page.locator('main').getByRole('link', { name: title }).first().click()
      await page.waitForURL(url)
    }
  })

  test('is what the header Docs link points at', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('banner').getByRole('link', { name: 'Docs' }).click()
    await expect(page).toHaveURL('/docs')
  })

  test('the old /docs/self-hosting URL redirects to /docs/install', async ({ page }) => {
    await page.goto('/docs/self-hosting')
    await expect(page).toHaveURL('/docs/install')
  })
})

test.describe('Install page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/install')
  })

  test('does not teach the provider contract', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText('connector_')).toHaveCount(0)
  })

  test('walks the local install and shows create-admin', async ({ page }) => {
    await expect(page.locator('#walkthrough')).toBeVisible()
    await expect(page.getByText('npm run create-admin').first()).toBeVisible()
  })

  test('switches deployment tabs', async ({ page }) => {
    const deploy = page.locator('#deploy')
    await expect(deploy.getByText('docker compose up -d db api')).toBeVisible()

    await deploy.getByRole('tab', { name: 'Cloudflare Workers' }).click()

    await expect(deploy.getByText('npx wrangler secret put DATABASE_URL')).toBeVisible()
    await expect(deploy.getByText('docker compose up -d db api')).not.toBeVisible()
  })

  test('gives the schema command of the engine you pick', async ({ page }) => {
    const schema = page.locator('#schema')
    await expect(schema.getByText('src/db/schema.sql').first()).toBeVisible()

    await schema.getByRole('tab', { name: 'MongoDB' }).click()

    // MongoDB n'a pas de schéma à appliquer : la commande ne pose que les index.
    await expect(schema.getByText('createIndex')).toBeVisible()
    await expect(schema.getByText('src/db/schema.sql')).toHaveCount(0)
  })

  test('covers registration modes and OAuth in an authentication section', async ({ page }) => {
    const auth = page.locator('#authentication')
    await expect(auth).toBeVisible()
    await expect(auth.getByText('REGISTRATION_MODE')).toBeVisible()
    await expect(auth.getByText('/auth/oauth/<provider>/callback')).toBeVisible()
  })

  test('leads back to the documentation index', async ({ page }) => {
    await page.locator('main').getByRole('link', { name: /^←/ }).click()
    await expect(page).toHaveURL('/docs')
  })
})

test.describe('Administration page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/admin')
  })

  test('covers the admin web UI, roles and flux approval', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('#roles')).toBeVisible()
    await expect(page.locator('#flux-approval')).toBeVisible()
    const body = await page.locator('main').innerText()
    expect(body).toContain('/admin/flux-requests')
  })

  test('documents secondary databases', async ({ page }) => {
    await expect(page.locator('#secondary-databases')).toBeVisible()
    const body = await page.locator('main').innerText()
    expect(body).toContain('/admin/data-sources')
  })
})

test.describe('Providers page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/providers')
  })

  test('explains the idea before the technical contract', async ({ page }) => {
    const concept = await page.locator('#what-is-a-provider').boundingBox()
    const contract = await page.locator('#technical-contract').boundingBox()

    expect(concept).not.toBeNull()
    expect(contract).not.toBeNull()
    // Le contrat de référence arrive après l'explication, jamais avant.
    expect(contract!.y).toBeGreaterThan(concept!.y)
    // Le contrat est une API HTTP : plus aucun DDL sur la page.
    await expect(page.getByText('CREATE TABLE')).toHaveCount(0)
  })

  test('states the contract as /connector-api endpoints and links the template reference', async ({
    page,
  }) => {
    const contract = page.locator('#technical-contract')
    await expect(contract).toBeVisible()
    await expect(contract.getByText('POST /connector-api/<name>/register').first()).toBeVisible()
    await expect(contract.getByText('POST /connector-api/<name>/items').first()).toBeVisible()
    // La forme d'un item est décrite.
    await expect(contract.getByText('repositoryId').first()).toBeVisible()
    await expect(page.locator('#display-templates')).toBeVisible()
  })

  test('ticks a checklist item', async ({ page }) => {
    const item = page.getByRole('button', { name: /connector-api\/<name>\/register/ })
    await expect(item).toHaveAttribute('aria-pressed', 'false')
    await item.click()
    await expect(item).toHaveAttribute('aria-pressed', 'true')
  })

  test('points at the install guide for what you need', async ({ page }) => {
    await page.locator('#where-it-writes').getByRole('link').click()
    await expect(page).toHaveURL('/docs/install')
  })

  test('the worked-examples section leads to the tutorial', async ({ page }) => {
    await page.locator('#existing-providers').getByRole('link').click()
    await expect(page).toHaveURL('/docs/providers/tutorial')
  })
})

test.describe('Provider tutorial', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/providers/tutorial')
  })

  test('shows the whole connector as copyable code', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const main = page.locator('main')
    // The Hacker News API and the connector-api calls both appear verbatim.
    await expect(main.getByText('hacker-news.firebaseio.com').first()).toBeVisible()
    await expect(main.getByText('/connector-api/').first()).toBeVisible()
    await expect(page.locator('#the-whole-file')).toBeVisible()
  })

  test('leads back to the provider page', async ({ page }) => {
    await page.locator('main').getByRole('link', { name: /^←/ }).click()
    await expect(page).toHaveURL('/docs/providers')
  })
})

// Régression : l'en-tête est partagé avec les pages de doc, où #features et
// #download ne correspondent à aucune section. Les liens doivent donc ramener
// vers l'accueil, tout en continuant à défiler quand on y est déjà.
test.describe('Header anchors', () => {
  for (const [label, anchor] of [
    ['Fonctionnalités', 'features'],
    ['Télécharger', 'download'],
  ] as const) {
    test(`"${label}" leads back to the landing section from the docs`, async ({ page }) => {
      await page.goto('/docs/install')
      await page.getByRole('banner').getByRole('link', { name: label }).click()

      await expect(page).toHaveURL(`/#${anchor}`)
      await expect(page.locator(`#${anchor}`)).toBeInViewport()
    })

    test(`"${label}" still scrolls when already on the landing page`, async ({ page }) => {
      await page.goto('/')
      await page.getByRole('banner').getByRole('link', { name: label }).click()

      await expect(page).toHaveURL(`/#${anchor}`)
      await expect(page.locator(`#${anchor}`)).toBeInViewport()
    })
  }
})
