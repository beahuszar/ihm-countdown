import { useEffect, useState } from 'react'
import './App.css'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const nextConcertDate = [new Date('2026-11-14T20:00:00').getTime(), new Date('2026-11-15T20:00:00').getTime()].find((date) => date > Date.now())
const year = nextConcertDate ? new Date(nextConcertDate).getFullYear() : '????'
const month = nextConcertDate ? new Date(nextConcertDate).getMonth() + 1 : '???'
const day = nextConcertDate ? new Date(nextConcertDate).getDate() : '??'
const hour = nextConcertDate ? new Date(nextConcertDate).getHours() : '??'
const minute = nextConcertDate ? new Date(nextConcertDate).getMinutes() : '??'

function getTimeLeft(): TimeLeft {
  if (!nextConcertDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const difference = nextConcertDate - Date.now()

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
        {nextConcertDate ? <h1 className="title">Mikor lesz már IHM koncert?</h1> : <h1 className="title">Mikor lesz már IHM koncert újra? 🥹</h1>}
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
        <div className="date-info">{year}. {month.toString().padStart(2, '0')}. {day.toString().padStart(2, '0')}. {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}</div>
      </div>
    </div>
  )
}

export default App
