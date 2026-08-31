import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import App from './App'

const CONCERT_DATE = new Date('2026-04-25T20:30:00').getTime()

function timeValues(container: HTMLElement) {
  return Array.from(container.querySelectorAll('.time-value')).map((el) => el.textContent)
}

function setNowRelativeToConcert(msBeforeConcert: number) {
  vi.setSystemTime(new Date(CONCERT_DATE - msBeforeConcert))
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders the title and logo', () => {
    setNowRelativeToConcert(1000)
    const { getByRole } = render(<App />)

    expect(getByRole('heading', { name: /IHM koncert/i })).toBeInTheDocument()
    expect(getByRole('img', { name: /IHM Logo/i })).toBeInTheDocument()
  })

  it('renders the correct initial countdown values', () => {
    const days = 2
    const hours = 3
    const minutes = 4
    const seconds = 5
    const msBeforeConcert = (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000

    setNowRelativeToConcert(msBeforeConcert)
    const { container } = render(<App />)

    expect(timeValues(container)).toEqual(['02', '03', '04', '05'])
  })

  it('ticks the seconds down every second', () => {
    setNowRelativeToConcert(5000)
    const { container } = render(<App />)

    expect(timeValues(container)).toEqual(['00', '00', '00', '05'])

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(timeValues(container)).toEqual(['00', '00', '00', '04'])
  })

  it('shows all zeros once the concert date has already passed', () => {
    setNowRelativeToConcert(-1000)
    const { container } = render(<App />)

    expect(timeValues(container)).toEqual(['00', '00', '00', '00'])
  })

  it('stops updating once the countdown reaches zero', () => {
    setNowRelativeToConcert(2000)
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    const { container } = render(<App />)

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

  it('clears the interval on unmount', () => {
    setNowRelativeToConcert(10000)
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    const { unmount } = render(<App />)

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1)
  })
})
