import { expect, test } from '@playwright/test'

test('renders the countdown page', async ({ page }, testInfo) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /IHM koncert/i })).toBeVisible()

  const screenshotPath = testInfo.outputPath('countdown.png')
  await page.screenshot({ path: screenshotPath, fullPage: true })
  await testInfo.attach('countdown', { path: screenshotPath, contentType: 'image/png' })
})
