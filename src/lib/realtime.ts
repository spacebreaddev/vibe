import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

function getSocket(): Socket {
  if (!socket) {
    const url = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001'
    socket = io(url, { autoConnect: true })
  }
  return socket
}

// ── Outbound ─────────────────────────────────────────────────────────────────

export interface GridItem { id: number; label: string; icon: string }

export function joinGame(name: string, grid: GridItem[]) {
  getSocket().emit('join', { name, grid })
}

export function startGame(name: string) {
  getSocket().emit('start_game', { name })
}

export function broadcastEndGame(name: string) {
  getSocket().emit('end_game', { name })
}

export function sendMarkUpdate(marked: number[]) {
  getSocket().emit('mark_update', { marked })
}

export function resetGame(name: string) {
  getSocket().emit('reset_game', { name })
}

// ── Inbound ──────────────────────────────────────────────────────────────────

export interface PlayerResult {
  name: string
  bingos: number
  markedCount: number
  winningItems: { icon: string; label: string }[]
}

type Off = () => void

export function onGameState(cb: (state: string) => void): Off {
  const s = getSocket()
  s.on('game_state', ({ state }: { state: string }) => cb(state))
  return () => s.off('game_state', cb)
}

export function onJoinAccepted(cb: () => void): Off {
  const s = getSocket()
  s.on('join_accepted', cb)
  return () => s.off('join_accepted', cb)
}

export function onJoinRejected(cb: (reason: string) => void): Off {
  const s = getSocket()
  s.on('join_rejected', ({ reason }: { reason: string }) => cb(reason))
  return () => s.off('join_rejected', cb)
}

export function onPlayerCount(cb: (count: number) => void): Off {
  const s = getSocket()
  s.on('player_count', (count: number) => cb(count))
  return () => s.off('player_count', cb)
}

export function onGameStarted(cb: () => void): Off {
  const s = getSocket()
  s.on('game_started', cb)
  return () => s.off('game_started', cb)
}

export function onGameEnded(cb: (summary: PlayerResult[]) => void): Off {
  const s = getSocket()
  s.on('game_ended', ({ summary }: { summary: PlayerResult[] }) => cb(summary))
  return () => s.off('game_ended', cb)
}

export function onGameReset(cb: () => void): Off {
  const s = getSocket()
  s.on('game_reset', cb)
  return () => s.off('game_reset', cb)
}
