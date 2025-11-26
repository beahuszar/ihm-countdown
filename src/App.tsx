import { useState, useEffect } from 'react'
import './App.css'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function App() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = new Date('2026-04-24T20:00:00')

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container">
      <div className="flames-overlay"></div>
      <div className="content">
        <img src="/image.png" alt="IHM Logo" className="logo" />
        <h1 className="title">Mikor lesz már IHM koncert?</h1>
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
        <div className="date-info">2026. ÁPRILIS 24. - 20:00</div>
      </div>
    </div>
  )
}

export default App
