import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())
app.get('/health', (_req, res) => res.send('ok'))

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

// ── Game state ──────────────────────────────────────────────────────────────
let gameState = 'waiting' // 'waiting' | 'playing' | 'ended'
// socketId -> { name, grid, marked: number[] }
const players = new Map()

const HOST_NAME = 'Super Derrick'

// ── Helpers ─────────────────────────────────────────────────────────────────
function getWinningLines(marked) {
  const s = new Set(marked)
  const lines = []
  for (let r = 0; r < 5; r++) {
    const row = [r*5, r*5+1, r*5+2, r*5+3, r*5+4]
    if (row.every(i => s.has(i))) lines.push(row)
  }
  for (let c = 0; c < 5; c++) {
    const col = [c, c+5, c+10, c+15, c+20]
    if (col.every(i => s.has(i))) lines.push(col)
  }
  if ([0,6,12,18,24].every(i => s.has(i))) lines.push([0,6,12,18,24])
  if ([4,8,12,16,20].every(i => s.has(i))) lines.push([4,8,12,16,20])
  return lines
}

function buildSummary() {
  return [...players.values()]
    .map(p => {
      const winLines = getWinningLines(p.marked)
      // Collect items that appear in winning lines (unique)
      const winCells = new Set(winLines.flat())
      const winningItems = [...winCells]
        .filter(i => p.grid[i]?.id !== 0)
        .map(i => ({ icon: p.grid[i].icon, label: p.grid[i].label }))
      return {
        name: p.name,
        bingos: winLines.length,
        markedCount: p.marked.filter(i => p.grid[i]?.id !== 0).length,
        winningItems,
      }
    })
    .sort((a, b) => b.bingos - a.bingos || b.markedCount - a.markedCount)
}

// ── Socket events ────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('Connected:', socket.id)

  // Send current state to newly connected client
  socket.emit('game_state', { state: gameState })

  socket.on('join', ({ name, grid }) => {
    if (gameState !== 'waiting') {
      socket.emit('join_rejected', {
        reason: gameState === 'playing'
          ? 'Game already in progress — wait for the next round.'
          : 'Game has ended — wait for the next round.',
      })
      return
    }
    players.set(socket.id, { name, grid, marked: [12] })
    console.log(`${name} joined (${players.size} players)`)
    socket.emit('join_accepted')
    io.emit('player_count', players.size)
  })

  socket.on('start_game', ({ name }) => {
    if (name !== HOST_NAME || gameState !== 'waiting') return
    gameState = 'playing'
    console.log('Game started by', name)
    io.emit('game_started')
  })

  socket.on('mark_update', ({ marked }) => {
    const p = players.get(socket.id)
    if (p) p.marked = marked
  })

  socket.on('end_game', ({ name }) => {
    if (name !== HOST_NAME || gameState !== 'playing') return
    gameState = 'ended'
    const summary = buildSummary()
    console.log('Game ended by', name, '— winners:', summary.filter(p => p.bingos > 0).map(p => p.name))
    io.emit('game_ended', { summary })
  })

  socket.on('reset_game', ({ name }) => {
    if (name !== HOST_NAME) return
    gameState = 'waiting'
    players.clear()
    console.log('Game reset by', name)
    io.emit('game_reset')
  })

  socket.on('disconnect', () => {
    const p = players.get(socket.id)
    if (p) {
      console.log(`${p.name} disconnected`)
      players.delete(socket.id)
      if (gameState === 'waiting') io.emit('player_count', players.size)
    }
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => console.log(`Bingo server running on port ${PORT}`))
