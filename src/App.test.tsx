import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import type App from './App'

const FIRST_CONCERT_DATE = new Date('2026-11-14T20:00:00').getTime()
const SECOND_CONCERT_DATE = new Date('2026-11-15T20:00:00').getTime()

function timeValues(container: HTMLElement) {
  return Array.from(container.querySelectorAll('.time-value')).map((el) => el.textContent)
}

function dateInfo(container: HTMLElement) {
  return container.querySelector('.date-info')?.textContent
}

// App.tsx derives the next concert date from Date.now() at module load time,
// so each scenario needs a fresh module instance evaluated under the mocked clock.
async function renderAppAt(now: number) {
  vi.setSystemTime(new Date(now))
  vi.resetModules()
  const { default: AppComponent }: { default: typeof App } = await import('./App')
  return render(<AppComponent />)
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders the logo', async () => {
    const { getByRole } = await renderAppAt(FIRST_CONCERT_DATE - 1000)

    expect(getByRole('img', { name: /IHM Logo/i })).toBeInTheDocument()
  })

  it('renders the upcoming-concert title when a concert is scheduled', async () => {
    const { getByRole } = await renderAppAt(FIRST_CONCERT_DATE - 1000)

    expect(getByRole('heading', { name: 'Mikor lesz már IHM koncert?' })).toBeInTheDocument()
  })

  it('renders the no-concert title once every concert date has passed', async () => {
    const { getByRole } = await renderAppAt(SECOND_CONCERT_DATE + 1000)

    expect(getByRole('heading', { name: 'Mikor lesz már IHM koncert újra? 🥹' })).toBeInTheDocument()
  })

  it('renders the correct initial countdown values', async () => {
    const days = 2
    const hours = 3
    const minutes = 4
    const seconds = 5
    const msBeforeConcert = (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000

    const { container } = await renderAppAt(FIRST_CONCERT_DATE - msBeforeConcert)

    expect(timeValues(container)).toEqual(['02', '03', '04', '05'])
  })

  it('ticks the seconds down every second', async () => {
    const { container } = await renderAppAt(FIRST_CONCERT_DATE - 5000)

    expect(timeValues(container)).toEqual(['00', '00', '00', '05'])

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(timeValues(container)).toEqual(['00', '00', '00', '04'])
  })

  it('renders the upcoming concert date info', async () => {
    const { container } = await renderAppAt(FIRST_CONCERT_DATE - 1000)

    expect(dateInfo(container)).toBe('2026. 11. 14. 20:00')
  })

  it('counts down to the second concert date once the first one has passed', async () => {
    const { container } = await renderAppAt(SECOND_CONCERT_DATE - 1000)

    expect(timeValues(container)).toEqual(['00', '00', '00', '01'])
    expect(dateInfo(container)).toBe('2026. 11. 15. 20:00')
  })

  it('shows all zeros once every concert date has already passed', async () => {
    const { container } = await renderAppAt(SECOND_CONCERT_DATE + 1000)

    expect(timeValues(container)).toEqual(['00', '00', '00', '00'])
  })

  it('shows placeholder date info once every concert date has already passed', async () => {
    const { container } = await renderAppAt(SECOND_CONCERT_DATE + 1000)

    expect(dateInfo(container)).toBe('????. ???. ??. ??:??')
  })

  it('stops updating once the countdown reaches zero', async () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    const { container } = await renderAppAt(SECOND_CONCERT_DATE - 2000)

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(timeValues(container)).toEqual(['00', '00', '00', '00'])
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(timeValues(container)).toEqual(['00', '00', '00', '00'])
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1)
  })

  it('clears the interval on unmount', async () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    const { unmount } = await renderAppAt(SECOND_CONCERT_DATE - 10000)

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1)
  })
})
