import type { BingoItem } from '../data/bingoItems'
import { getWinningLines } from '../data/bingoItems'
import BingoCell from './BingoCell'

interface Props {
  grid: BingoItem[]
  marked: Set<number>
  gameRunning: boolean
  onToggle: (index: number) => void
}

export default function BingoCard({ grid, marked, gameRunning, onToggle }: Props) {
  const winningLines = getWinningLines(marked)
  const winningCells = new Set(winningLines.flat())

  const headers = ['B', 'I', 'N', 'G', 'O']

  return (
    <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto' }}>
      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '6px',
          marginBottom: '6px',
        }}
      >
        {headers.map((h) => (
          <div
            key={h}
            style={{
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: 900,
              letterSpacing: '0.1em',
              background: 'linear-gradient(135deg, #c8102e, #ff6b35)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
              fontFamily: "'Georgia', serif",
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '6px',
        }}
      >
        {grid.map((item, i) => (
          <BingoCell
            key={`${item.id}-${i}`}
            item={item}
            index={i}
            marked={marked.has(i)}
            winning={winningCells.has(i)}
            gameRunning={gameRunning}
            onToggle={onToggle}
          />
        ))}
      </div>

      {/* Win count */}
      {winningLines.length > 0 && (
        <div
          style={{
            marginTop: '14px',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#ffd700',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {winningLines.length} BINGO{winningLines.length > 1 ? 'S' : ''} 🎉
        </div>
      )}
    </div>
  )
}
