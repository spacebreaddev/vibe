const HOST_NAME = 'Super Derrick'

interface Props {
  playerName: string
  playerCount: number
  onStartGame: () => void
}

export default function WaitingRoom({ playerName, playerCount, onStartGame }: Props) {
  const isHost = playerName === HOST_NAME

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
      <div
        style={{
          background: 'rgba(18,18,30,0.95)',
          border: '1px solid #2e2e4a',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 0 60px #c8102e22, 0 20px 60px #00000088',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
          {isHost ? '🎬' : '⏳'}
        </div>

        <h2
          style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            fontFamily: "'Georgia', serif",
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #c8102e 0%, #ff6b35 50%, #ffd700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 0.4rem',
          }}
        >
          {isHost ? 'Ready to Start?' : 'Waiting for Host'}
        </h2>

        <p style={{ color: '#6666aa', fontSize: '0.82rem', marginBottom: '2rem' }}>
          {isHost
            ? 'Everyone is locked in. Start the game when ready.'
            : 'The game will begin once Super Derrick starts it.'}
        </p>

        {/* Player count badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0d0d1a',
            border: '1px solid #2e2e4a',
            borderRadius: '10px',
            padding: '0.5rem 1.2rem',
            marginBottom: '2rem',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>👥</span>
          <span style={{ color: '#e2e2f0', fontSize: '0.9rem', fontWeight: 700 }}>
            {playerCount} {playerCount === 1 ? 'player' : 'players'} joined
          </span>
        </div>

        {/* Pulsing dots for non-host waiting state */}
        {!isHost && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '2rem' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#c8102e',
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* Host-only start button */}
        {isHost && (
          <button
            onClick={onStartGame}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.85rem 1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px #22c55e44',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = 'scale(1)')}
          >
            🚀 Start Game
          </button>
        )}

        <p style={{ color: '#333355', fontSize: '0.68rem', marginTop: '1.5rem', letterSpacing: '0.08em' }}>
          {playerName}
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
