import { expect, test } from '@playwright/test'

test('renders the countdown page', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /IHM koncert/i })).toBeVisible()

  await page.screenshot({ path: 'playwright-results/screenshots/countdown.png', fullPage: true })
})
