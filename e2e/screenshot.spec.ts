import path from 'node:path'
import { expect, test, type TestInfo } from '@playwright/test'

// <classname>__<name>__<label>.<ext>, the file name convention the Bitrise Export step links by.
function attachmentPath(testInfo: TestInfo, label: string, ext: string) {
  const clean = (part: string) => part.replace(/["*/:<>?\\|]/g, '_')
  const classname = path.relative(testInfo.project.testDir, testInfo.file)
  return testInfo.outputPath(`${clean(classname)}__${clean(testInfo.title)}__${label}.${ext}`)
}

const FIRST_CONCERT_DATE = new Date('2026-11-14T20:00:00')
const SECOND_CONCERT_DATE = new Date('2026-11-15T20:00:00')

test('renders the countdown page', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date(FIRST_CONCERT_DATE.getTime() - 2 * 24 * 60 * 60 * 1000))
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Mikor lesz már IHM koncert?' })).toBeVisible()
  await expect(page.locator('.date-info')).toHaveText('2026. 11. 14. 20:00')

  const screenshotPath = attachmentPath(testInfo, 'countdown', 'png')
  await page.screenshot({ path: screenshotPath, fullPage: true })
  await testInfo.attach('countdown', { path: screenshotPath, contentType: 'image/png' })
})

test('renders the placeholder date once every concert date has passed', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date(SECOND_CONCERT_DATE.getTime() + 60 * 60 * 1000))
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Mikor lesz már IHM koncert újra? 🥹' })).toBeVisible()
  await expect(page.locator('.date-info')).toHaveText('????. ???. ??. ??:??')

  const screenshotPath = attachmentPath(testInfo, 'countdown-no-next-date', 'png')
  await page.screenshot({ path: screenshotPath, fullPage: true })
  await testInfo.attach('countdown-no-next-date', { path: screenshotPath, contentType: 'image/png' })
})
