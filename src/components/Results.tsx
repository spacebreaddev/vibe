import type { BingoItem } from '../data/bingoItems'
import { getWinningLines } from '../data/bingoItems'

interface Props {
  playerName: string
  grid: BingoItem[]
  marked: Set<number>
  onPlayAgain: () => void
}

export default function Results({ playerName, grid, marked, onPlayAgain }: Props) {
  const winningLines = getWinningLines(marked)
  const markedItems = Array.from(marked)
    .filter((i) => grid[i]?.id !== 0)
    .map((i) => grid[i])

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
          padding: '2.5rem 2rem',
          maxWidth: '540px',
          width: '100%',
          boxShadow: '0 0 60px #c8102e22, 0 20px 60px #00000088',
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          {winningLines.length > 0 ? '🎉' : '🎬'}
        </div>

        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 900,
            fontFamily: "'Georgia', serif",
            letterSpacing: '0.08em',
            background:
              winningLines.length > 0
                ? 'linear-gradient(135deg, #ffd700, #ff6b35)'
                : 'linear-gradient(135deg, #c8102e, #ff6b35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 0.25rem',
          }}
        >
          {winningLines.length > 0 ? `BINGO!` : `Game Over`}
        </h2>

        <p style={{ color: '#9999bb', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {playerName} •{' '}
          {winningLines.length > 0
            ? `${winningLines.length} line${winningLines.length > 1 ? 's' : ''} completed`
            : 'Better luck next time!'}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <Stat label="Squares Marked" value={markedItems.length} />
          <Stat label="Bingos" value={winningLines.length} highlight={winningLines.length > 0} />
          <Stat label="Total Squares" value={24} />
        </div>

        {/* Marked items list */}
        {markedItems.length > 0 && (
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <p
              style={{
                color: '#6666aa',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              What happened this meeting
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {markedItems.map((item) => (
                <span
                  key={item.id}
                  style={{
                    background: '#1a1a2e',
                    border: '1px solid #2e2e4a',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    color: '#b0b0d0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onPlayAgain}
          style={{
            background: 'linear-gradient(135deg, #c8102e 0%, #ff6b35 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.75rem 2rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px #c8102e55',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = 'scale(1)')}
        >
          New Card 🔄
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      style={{
        background: '#0d0d1a',
        border: `1px solid ${highlight ? '#ffd70044' : '#2e2e4a'}`,
        borderRadius: '10px',
        padding: '0.6rem 1rem',
        minWidth: '80px',
      }}
    >
      <div
        style={{
          fontSize: '1.6rem',
          fontWeight: 900,
          color: highlight ? '#ffd700' : '#c8102e',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '0.62rem', color: '#6666aa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </div>
    </div>
  )
}
