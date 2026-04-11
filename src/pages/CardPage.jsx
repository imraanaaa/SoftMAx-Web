import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function FlameIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" ry="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}

function ProgressCard({
  kicker = 'Softmaxx',
  title = 'Share Your Progress',
  subtitle = 'Let friends see your streaks, wins, and daily growth',
  avatars = [
    { initial: 'A', tone: 'gold' },
    { initial: 'M', tone: 'violet' },
    { initial: 'K', tone: 'bronze' },
  ],
  streakDays = 12,
  winsShared = 8,
  currentProgress = 2,
  totalProgress = 3,
  locked = true,
}) {
  const [fillWidth, setFillWidth] = useState('0%')
  const targetFill = `${Math.min(100, Math.round((currentProgress / totalProgress) * 100))}%`

  useEffect(() => {
    const timer = window.setTimeout(() => setFillWidth(targetFill), 320)
    return () => window.clearTimeout(timer)
  }, [targetFill])

  return (
    <article className="progress-card" aria-labelledby="progress-card-title">
      <header className="progress-card-header">
        <p className="progress-card-kicker">{kicker}</p>
        <h2 className="progress-card-title" id="progress-card-title">
          {title}
        </h2>
        <p className="progress-card-subtitle">{subtitle}</p>
      </header>

      <div className="progress-card-body">
        <div className="progress-avatars" aria-hidden="true">
          {avatars.map((avatar, index) => (
            <div
              className={`progress-avatar progress-avatar--${avatar.tone ?? 'gold'}`}
              key={`${avatar.initial}-${index}`}
            >
              {avatar.initial}
            </div>
          ))}
        </div>

        <div className="progress-stats">
          <div className="progress-stat">
            <span className="progress-stat-icon">
              <FlameIcon />
            </span>
            <span className="progress-stat-value">{streakDays}</span>
            <span className="progress-stat-label">Day Streak</span>
          </div>
          <span className="progress-stat-divider" aria-hidden="true" />
          <div className="progress-stat">
            <span className="progress-stat-icon">
              <TrophyIcon />
            </span>
            <span className="progress-stat-value">{winsShared}</span>
            <span className="progress-stat-label">Wins Shared</span>
          </div>
        </div>
      </div>

      <footer className="progress-card-footer">
        <div className="progress-bar-row">
          <div
            className="progress-bar-track"
            role="progressbar"
            aria-valuenow={currentProgress}
            aria-valuemin={0}
            aria-valuemax={totalProgress}
          >
            <div className="progress-bar-fill" style={{ width: fillWidth }} />
          </div>
          {locked ? (
            <span className="progress-bar-lock" aria-label="Locked">
              <LockIcon />
            </span>
          ) : null}
        </div>
        <div className="progress-bar-meta">
          <span className="progress-pill">
            {currentProgress}/{totalProgress} Days
          </span>
          <span className="progress-bar-hint">
            {locked ? `Unlock share at day ${totalProgress}` : 'Ready to share'}
          </span>
        </div>
      </footer>

      <button className="progress-share-btn" type="button">
        <ShareIcon />
        <span>Share Progress</span>
      </button>
    </article>
  )
}

function CardPage() {
  return (
    <main className="page-shell card-shell">
      <div className="ambient-orbs" aria-hidden="true">
        <div className="ambient-orb ambient-orb--1" />
        <div className="ambient-orb ambient-orb--2" />
        <div className="ambient-orb ambient-orb--3" />
        <div className="ambient-orb ambient-orb--4" />
      </div>

      <section className="card-layout" aria-labelledby="progress-card-title">
        <Link className="card-back-link" to="/">
          ← Back to Softmaxx
        </Link>
        <ProgressCard />
      </section>
    </main>
  )
}

export default CardPage
