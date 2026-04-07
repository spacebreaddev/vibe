import { useState, useEffect, useRef } from 'react'
import { buildGrid, getWinningLines } from './data/bingoItems'
import type { BingoItem } from './data/bingoItems'
import Lobby from './components/Lobby'
import WaitingRoom from './components/WaitingRoom'
import BingoCard from './components/BingoCard'
import Results from './components/Results'
import {
  joinGame, startGame, broadcastEndGame, sendMarkUpdate, resetGame,
  onGameState, onJoinAccepted, onJoinRejected, onPlayerCount,
  onGameStarted, onGameEnded, onGameReset,
} from './lib/realtime'
import type { PlayerResult } from './lib/realtime'

type Phase = 'lobby' | 'waiting' | 'playing' | 'ended'

const HOST_NAME = 'Super Derrick'

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
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
`

export default function App() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [serverState, setServerState] = useState<string>('waiting')
  const [playerName, setPlayerName] = useState('')
  const [grid, setGrid] = useState<BingoItem[]>([])
  const [marked, setMarked] = useState<Set<number>>(new Set([12]))
  const [playerCount, setPlayerCount] = useState(0)
  const [prevBingos, setPrevBingos] = useState(0)
  const [newBingo, setNewBingo] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [summary, setSummary] = useState<PlayerResult[]>([])
  const bingoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = KEYFRAMES
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  // ── Server event listeners ────────────────────────────────────────────────
  useEffect(() => {
    const offs = [
      onGameState((state) => setServerState(state)),
      onJoinAccepted(() => setPhase('waiting')),
      onJoinRejected((reason) => setJoinError(reason)),
      onPlayerCount((count) => setPlayerCount(count)),
      onGameStarted(() => {
        setPhase('playing')
        setPrevBingos(0)
      }),
      onGameEnded((s) => {
        setSummary(s)
        setPhase('ended')
      }),
      onGameReset(() => {
        setPhase('lobby')
        setPlayerName('')
        setGrid([])
        setMarked(new Set([12]))
        setSummary([])
        setJoinError(null)
        setPrevBingos(0)
        setNewBingo(false)
      }),
    ]
    return () => offs.forEach((off) => off())
  }, [])

  // Detect new bingos
  const winningLines = getWinningLines(marked)
  useEffect(() => {
    if (winningLines.length > prevBingos && phase === 'playing') {
      setNewBingo(true)
      setPrevBingos(winningLines.length)
      if (bingoTimeoutRef.current) clearTimeout(bingoTimeoutRef.current)
      bingoTimeoutRef.current = setTimeout(() => setNewBingo(false), 2500)
    }
  }, [winningLines.length])

  // Sync mark state to server whenever it changes during play
  useEffect(() => {
    if (phase === 'playing') {
      sendMarkUpdate(Array.from(marked))
    }
  }, [marked, phase])

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleJoin(name: string) {
    const newGrid = buildGrid()
    setPlayerName(name)
    setGrid(newGrid)
    setMarked(new Set([12]))
    setJoinError(null)
    joinGame(name, newGrid)
  }

  function handleStartGame() {
    startGame(playerName)
  }

  function handleToggle(index: number) {
    setMarked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function handleEnd() {
    broadcastEndGame(playerName)
  }

  function handlePlayAgain() {
    if (playerName === HOST_NAME) {
      // Host resets for everyone
      resetGame(playerName)
    } else {
      // Non-host just goes back to their lobby locally
      setPhase('lobby')
      setPlayerName('')
      setGrid([])
      setMarked(new Set([12]))
      setSummary([])
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (phase === 'lobby') {
    return (
      <Lobby
        onStart={handleJoin}
        joinError={joinError}
        serverState={serverState}
      />
    )
  }

  if (phase === 'waiting') {
    return (
      <WaitingRoom
        playerName={playerName}
        playerCount={playerCount}
        onStartGame={handleStartGame}
      />
    )
  }

  if (phase === 'ended') {
    return (
      <Results
        playerName={playerName}
        grid={grid}
        marked={marked}
        summary={summary}
        onPlayAgain={handlePlayAgain}
      />
    )
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  const isHost = playerName === HOST_NAME

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

        {/* Only host sees End Game */}
        {isHost && (
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
        )}
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
        {!isHost && ' · Only Super Derrick can end the game'}
      </p>
    </div>
  )
}
