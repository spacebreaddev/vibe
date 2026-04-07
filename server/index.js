import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())
app.get('/health', (_req, res) => res.send('ok'))

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: { origin: '*' },
})

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id)

  socket.on('end_game', () => {
    console.log('Game ended by:', socket.id)
    io.emit('end_game')
  })

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Bingo server running on port ${PORT}`)
})
