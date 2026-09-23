import { expect, test } from '@playwright/test'

const FIRST_CONCERT_DATE = new Date('2026-11-14T20:00:00')
const SECOND_CONCERT_DATE = new Date('2026-11-15T20:00:00')

test('renders the countdown page', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date(FIRST_CONCERT_DATE.getTime() - 2 * 24 * 60 * 60 * 1000))
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Mikor lesz már IHM koncert?' })).toBeVisible()
  await expect(page.locator('.date-info')).toHaveText('2026. 11. 14. 20:00')

  const screenshotPath = testInfo.outputPath('countdown.png')
  await page.screenshot({ path: screenshotPath, fullPage: true })
  await testInfo.attach('countdown', { path: screenshotPath, contentType: 'image/png' })
})

test('renders the placeholder date once every concert date has passed', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date(SECOND_CONCERT_DATE.getTime() + 60 * 60 * 1000))
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Mikor lesz már IHM koncert újra? 🥹' })).toBeVisible()
  await expect(page.locator('.date-info')).toHaveText('????. ???. ??. ??:??')

  const screenshotPath = testInfo.outputPath('countdown-no-next-date.png')
  await page.screenshot({ path: screenshotPath, fullPage: true })
  await testInfo.attach('countdown-no-next-date', { path: screenshotPath, contentType: 'image/png' })
})
