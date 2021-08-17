import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { Message } from './types'

const app: express.Express = express()
app.use(cors())
const server = http.createServer(app)
const PORT = 3000
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080'
  },
})


app.get('/', (req, res) => {
  res.send('Hello!!!')
})

// 接続数
let connectionCount = 0
io.on('connection', async socket => {
  console.log('server connected!')
  connectionCount++
  io.emit('count', connectionCount)

  socket.broadcast.emit('message', {
    id: '',
    nickname: '',
    text: `${socket.id}が入室しました`
  } as Message)

  socket.on('message', (newMessage: Message) => {
    console.log(newMessage)
    io.emit('message', newMessage);
  })

  socket.on('disconnect', reason => {
    console.log(reason)
    connectionCount--
    socket.broadcast.emit('message', {
      id: '',
      nickname: '',
      text: `${socket.id}が退出しました`,
    } as Message)

    io.emit('count', connectionCount)
  })

  socket.on('start typing', user => {
    socket.broadcast.emit('start typing', user)
  })

  socket.on('stop typing', user => {
    socket.broadcast.emit('stop typing', user)
  })
})

server.listen(PORT, () => {
  console.log('Server Start!')
})
