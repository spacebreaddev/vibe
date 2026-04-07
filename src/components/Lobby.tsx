import { useState } from 'react'

interface Props {
  onStart: (playerName: string) => void
  joinError?: string | null
  serverState?: string
}

export default function Lobby({ onStart, joinError, serverState }: Props) {
  const [name, setName] = useState('')

  const gameActive = serverState === 'playing' || serverState === 'ended'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || gameActive) return
    onStart(trimmed)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0a0a14 0%, #12061e 60%, #1a0010 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {/* Film strip decoration top */}
      <FilmStrip />

      {/* Card */}
      <div
        style={{
          background: 'rgba(18,18,30,0.9)',
          border: '1px solid #2e2e4a',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 0 60px #c8102e22, 0 20px 60px #00000088',
          textAlign: 'center',
        }}
      >
        {/* Logo area */}
        <div style={{ marginBottom: '0.5rem', fontSize: '3rem' }}>🎬</div>
        <h1
          style={{
            fontSize: '2.6rem',
            fontWeight: 900,
            fontFamily: "'Georgia', serif",
            letterSpacing: '0.12em',
            background: 'linear-gradient(135deg, #c8102e 0%, #ff6b35 50%, #ffd700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 0.3rem',
          }}
        >
          BINGO
        </h1>
        <p
          style={{
            color: '#6666aa',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '2.5rem',
          }}
        >
          All-Hands Edition
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name…"
            maxLength={30}
            autoFocus
            style={{
              background: '#0d0d1a',
              border: '2px solid #2e2e4a',
              borderRadius: '10px',
              color: '#e2e2f0',
              fontSize: '1rem',
              padding: '0.75rem 1rem',
              outline: 'none',
              textAlign: 'center',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#c8102e')}
            onBlur={(e) => (e.target.style.borderColor = '#2e2e4a')}
          />

          <button
            type="submit"
            disabled={!name.trim() || gameActive}
            style={{
              background: name.trim() && !gameActive
                ? 'linear-gradient(135deg, #c8102e 0%, #ff6b35 100%)'
                : '#2e2e4a',
              color: name.trim() && !gameActive ? '#fff' : '#666',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.85rem 1rem',
              cursor: name.trim() && !gameActive ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: name.trim() && !gameActive ? '0 4px 20px #c8102e55' : 'none',
            }}
          >
            {gameActive ? '🔒 Game In Progress' : 'Get My Card 🎟️'}
          </button>
        </form>

        <p style={{ color: '#444466', fontSize: '0.72rem', marginTop: '1.5rem' }}>
          {gameActive
            ? 'A game is currently in progress. Wait for the next round.'
            : 'Your card is randomly generated — good luck!'}
        </p>

        {joinError && (
          <div
            style={{
              marginTop: '1rem',
              background: '#2a0a0a',
              border: '1px solid #c8102e55',
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              fontSize: '0.78rem',
              color: '#ff8888',
            }}
          >
            {joinError}
          </div>
        )}
      </div>

      <FilmStrip />
    </div>
  )
}

function FilmStrip() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        margin: '1.5rem 0',
        opacity: 0.25,
      }}
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '18px',
            height: '12px',
            borderRadius: '2px',
            background: '#888',
          }}
        />
      ))}
    </div>
  )
}
