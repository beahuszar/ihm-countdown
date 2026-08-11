import { useEffect, useState } from 'react'
import './App.css'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CONCERT_DATE = new Date('2026-04-25T20:30:00').getTime()

function getTimeLeft(): TimeLeft {
  const difference = CONCERT_DATE - Date.now()

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  return { days: 0, hours: 0, minutes: 0, seconds: 0 }
}

function App() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = getTimeLeft()
      setTimeLeft(updated)

      if (updated.days === 0 && updated.hours === 0 && updated.minutes === 0 && updated.seconds === 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container">
      <div className="flames-overlay"></div>
      <div className="content">
        <img src="/image.png" alt="IHM Logo" className="logo" />
        <h1 className="title">Mikor lesz már IHM koncert újra? 🥹</h1>
        <div className="countdown">
          <div className="time-block">
            <span className="time-value">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="time-label">NAP</span>
          </div>
          <div className="separator">:</div>
          <div className="time-block">
            <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="time-label">ÓRA</span>
          </div>
          <div className="separator">:</div>
          <div className="time-block">
            <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="time-label">PERC</span>
          </div>
          <div className="separator">:</div>
          <div className="time-block">
            <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="time-label">MP</span>
          </div>
        </div>
        <div className="date-info">2026. ???. ??:??</div>
      </div>
    </div>
  )
}

export default App
