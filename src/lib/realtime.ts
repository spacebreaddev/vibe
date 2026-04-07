import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

function getSocket(): Socket {
  if (!socket) {
    const url = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001'
    socket = io(url, { autoConnect: true })
  }
  return socket
}

export function broadcastEndGame() {
  getSocket().emit('end_game')
}

export function onEndGame(callback: () => void): () => void {
  const s = getSocket()
  s.on('end_game', callback)
  return () => s.off('end_game', callback)
}
