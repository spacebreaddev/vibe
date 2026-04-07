import type { BingoItem } from '../data/bingoItems'
import { getWinningLines } from '../data/bingoItems'
import type { PlayerResult } from '../lib/realtime'

const HOST_NAME = 'Super Derrick'

interface Props {
  playerName: string
  grid: BingoItem[]
  marked: Set<number>
  summary: PlayerResult[]
  onPlayAgain: () => void
}

export default function Results({ playerName, grid, marked, summary, onPlayAgain }: Props) {
  const winningLines = getWinningLines(marked)
  const markedItems = Array.from(marked)
    .filter((i) => grid[i]?.id !== 0)
    .map((i) => grid[i])

  const isHost = playerName === HOST_NAME
  const winners = summary.filter((p) => p.bingos > 0)
  const noWinners = summary.length > 0 && winners.length === 0

  const medalColors = ['#ffd700', '#c0c0c0', '#cd7f32']
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0a0a14 0%, #12061e 60%, #1a0010 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem 1rem',
        overflowY: 'auto',
      }}
    >
      {/* ── Global leaderboard ─────────────────────────────── */}
      {summary.length > 0 && (
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            marginBottom: '1.5rem',
            background: 'rgba(18,18,30,0.95)',
            border: '1px solid #2e2e4a',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 0 60px #c8102e22',
          }}
        >
          <h2
            style={{
              margin: '0 0 1.25rem',
              textAlign: 'center',
              fontSize: '1.4rem',
              fontWeight: 900,
              fontFamily: "'Georgia', serif",
              letterSpacing: '0.1em',
              background: winners.length > 0
                ? 'linear-gradient(135deg, #ffd700, #ff6b35)'
                : 'linear-gradient(135deg, #c8102e, #ff6b35)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {winners.length > 0 ? '🏆 Final Results' : '🎬 Final Results'}
          </h2>

          {noWinners && (
            <p style={{ textAlign: 'center', color: '#6666aa', fontSize: '0.85rem', marginBottom: '1rem' }}>
              No bingos this round — everyone was close!
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {summary.map((p, i) => (
              <div
                key={p.name}
                style={{
                  background: p.bingos > 0 ? 'rgba(255,215,0,0.06)' : '#0d0d1a',
                  border: `1px solid ${p.bingos > 0 ? '#ffd70033' : '#2e2e4a'}`,
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                {/* Rank */}
                <div
                  style={{
                    fontSize: '1.3rem',
                    minWidth: '28px',
                    textAlign: 'center',
                    marginTop: '2px',
                  }}
                >
                  {i < 3 && p.bingos > 0 ? medals[i] : `#${i + 1}`}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        color: i < 3 && p.bingos > 0 ? medalColors[i] : '#e2e2f0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.name}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: p.bingos > 0 ? '#ffd700' : '#444466',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {p.bingos > 0
                        ? `${p.bingos} BINGO${p.bingos > 1 ? 'S' : ''}`
                        : `${p.markedCount} squares`}
                    </span>
                  </div>

                  {/* Winning items */}
                  {p.winningItems.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {p.winningItems.map((item) => (
                        <span
                          key={item.label}
                          style={{
                            background: '#1a1a2e',
                            border: '1px solid #ffd70033',
                            borderRadius: '5px',
                            padding: '2px 6px',
                            fontSize: '0.66rem',
                            color: '#b0b0d0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          {item.icon} {item.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Personal card summary ───────────────────────────── */}
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(18,18,30,0.95)',
          border: '1px solid #2e2e4a',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 0 40px #00000066',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>
          {winningLines.length > 0 ? '🎉' : '🎬'}
        </div>

        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 900,
            fontFamily: "'Georgia', serif",
            letterSpacing: '0.08em',
            background: winningLines.length > 0
              ? 'linear-gradient(135deg, #ffd700, #ff6b35)'
              : 'linear-gradient(135deg, #c8102e, #ff6b35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 0.2rem',
          }}
        >
          Your Card — {playerName}
        </h3>

        <p style={{ color: '#6666aa', fontSize: '0.8rem', marginBottom: '1rem' }}>
          {winningLines.length > 0
            ? `${winningLines.length} line${winningLines.length > 1 ? 's' : ''} completed`
            : 'No bingo this round'}
          {' · '}
          {markedItems.length} / 24 squares marked
        </p>

        {markedItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {markedItems.map((item) => (
              <span
                key={item.id}
                style={{
                  background: '#1a1a2e',
                  border: '1px solid #2e2e4a',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.7rem',
                  color: '#b0b0d0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {item.icon} {item.label}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onPlayAgain}
          style={{
            background: isHost
              ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
              : 'linear-gradient(135deg, #c8102e 0%, #ff6b35 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.75rem 2rem',
            cursor: 'pointer',
            boxShadow: isHost ? '0 4px 20px #22c55e44' : '0 4px 20px #c8102e55',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = 'scale(1)')}
        >
          {isHost ? '🔄 New Game (reset everyone)' : '🔄 Back to Lobby'}
        </button>

        {!isHost && (
          <p style={{ color: '#333355', fontSize: '0.68rem', marginTop: '0.75rem' }}>
            Super Derrick will start the next round
          </p>
        )}
      </div>
    </div>
  )
}

