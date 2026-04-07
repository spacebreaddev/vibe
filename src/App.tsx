import { useState, useEffect, useRef } from 'react'
import { buildGrid, getWinningLines } from './data/bingoItems'
import type { BingoItem } from './data/bingoItems'
import Lobby from './components/Lobby'
import BingoCard from './components/BingoCard'
import Results from './components/Results'
import { broadcastEndGame, onEndGame } from './lib/realtime'

type Phase = 'lobby' | 'playing' | 'ended'

const KEYFRAMES = `
@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
@keyframes celebrate {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.18) rotate(-2deg); }
  60%  { transform: scale(1.12) rotate(2deg); }
  100% { transform: scale(1); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
`

export default function App() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [playerName, setPlayerName] = useState('')
  const [grid, setGrid] = useState<BingoItem[]>([])
  const [marked, setMarked] = useState<Set<number>>(new Set([12])) // FREE always marked
  const [prevBingos, setPrevBingos] = useState(0)
  const [newBingo, setNewBingo] = useState(false)
  const bingoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cross-machine end-game sync via Socket.io
  useEffect(() => {
    const unsub = onEndGame(() => setPhase('ended'))
    return unsub
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = KEYFRAMES
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  const winningLines = getWinningLines(marked)

  // Detect new bingos
  useEffect(() => {
    if (winningLines.length > prevBingos && phase === 'playing') {
      setNewBingo(true)
      setPrevBingos(winningLines.length)
      if (bingoTimeoutRef.current) clearTimeout(bingoTimeoutRef.current)
      bingoTimeoutRef.current = setTimeout(() => setNewBingo(false), 2500)
    }
  }, [winningLines.length])

  function handleStart(name: string) {
    setPlayerName(name)
    setGrid(buildGrid())
    setMarked(new Set([12]))
    setPrevBingos(0)
    setPhase('playing')
  }

  function handleToggle(index: number) {
    setMarked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  function handleEnd() {
    broadcastEndGame() // tells server → server tells all connected clients
  }

  function handlePlayAgain() {
    setPhase('lobby')
    setMarked(new Set([12]))
    setPrevBingos(0)
    setNewBingo(false)
  }

  if (phase === 'lobby') return <Lobby onStart={handleStart} />
  if (phase === 'ended') return (
    <Results
      playerName={playerName}
      grid={grid}
      marked={marked}
      onPlayAgain={handlePlayAgain}
    />
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0a0a14 0%, #12061e 60%, #1a0010 100%)',
        padding: '1.5rem 1rem 2rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto 1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          animation: 'fadeIn 0.4s ease',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '1.8rem',
              fontWeight: 900,
              fontFamily: "'Georgia', serif",
              letterSpacing: '0.12em',
              background: 'linear-gradient(135deg, #c8102e 0%, #ff6b35 50%, #ffd700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BINGO 🎬
          </h1>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#6666aa', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {playerName} · {marked.size - 1} / 24 marked
            {winningLines.length > 0 && ` · ${winningLines.length} BINGO${winningLines.length > 1 ? 'S' : ''}!`}
          </p>
        </div>

        <button
          onClick={handleEnd}
          style={{
            background: 'linear-gradient(135deg, #c8102e, #8b0000)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.55rem 1.2rem',
            fontWeight: 800,
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 2px 12px #c8102e55',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = 'scale(1)')}
        >
          End Game
        </button>
      </div>

      {/* Bingo celebration banner */}
      {newBingo && (
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #ffd700, #ff6b35)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            textAlign: 'center',
            fontWeight: 900,
            fontSize: '1.2rem',
            color: '#1a0010',
            letterSpacing: '0.15em',
            boxShadow: '0 0 30px #ffd70066',
            animation: 'celebrate 0.5s ease',
          }}
        >
          🎉 BINGO! 🎉
        </div>
      )}

      {/* Bingo card */}
      <div style={{ animation: 'fadeIn 0.5s ease' }}>
        <BingoCard
          grid={grid}
          marked={marked}
          gameRunning={true}
          onToggle={handleToggle}
        />
      </div>

      {/* Footer hint */}
      <p
        style={{
          textAlign: 'center',
          marginTop: '1rem',
          fontSize: '0.65rem',
          color: '#333355',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Click a square to mark it · Click again to unmark
      </p>
    </div>
  )
}
