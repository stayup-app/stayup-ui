import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays the hero heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/restez|stayup/i)
  })

  test('shows changelog and youtube features', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'GitHub Changelog' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Chaînes YouTube' })).toBeVisible()
  })

  test('has login and register buttons', async ({ page }) => {
    await expect(page.getByRole('link', { name: /se connecter/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /inscrire|commencer/i }).first()).toBeVisible()
  })

  test('login button navigates to /login', async ({ page }) => {
    await page
      .getByRole('link', { name: /se connecter/i })
      .first()
      .click()
    await expect(page).toHaveURL('/login')
  })

  test('register button navigates to /register', async ({ page }) => {
    await page
      .getByRole('link', { name: /inscrire|commencer/i })
      .first()
      .click()
    await expect(page).toHaveURL('/register')
  })
})

// Regression: the <select> carried `bg-transparent`, which makes the browser
// lose its dark palette for the dropdown — it showed white, with light labels
// inherited from the page, hence unreadable.
test.describe('Language switcher', () => {
  test('paints its options instead of leaving the browser default', async ({ page }) => {
    await page.goto('/')
    const select = page.getByLabel('Langue')
    await expect(select).toBeVisible()

    const styles = await select.evaluate((el) => {
      const trigger = getComputedStyle(el)
      const option = getComputedStyle((el as HTMLSelectElement).options[0])
      return {
        triggerBg: trigger.backgroundColor,
        optionBg: option.backgroundColor,
        optionColor: option.color,
      }
    })

    // The trigger stays blended into the header…
    expect(styles.triggerBg).toBe('rgba(0, 0, 0, 0)')
    // …but the options are painted explicitly, dark background and light text.
    expect(styles.optionBg).toBe('rgb(24, 28, 39)')
    expect(styles.optionColor).toBe('rgb(242, 237, 226)')
  })

  test('still switches the language', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Langue').selectOption('en')
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible()
  })
})
