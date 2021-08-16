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

io.on('connection', socket => {
  console.log('server connected!')
  socket.broadcast.emit('message', {
    id: '',
    text: `${socket.id}が入室しました`
  } as Message)

  socket.on('message', (newMessage: Message) => {
    console.log('message come')
    console.log(newMessage)
    io.emit('message', newMessage);
  })

  socket.on('disconnect', reason => {
    console.log(reason)
    socket.broadcast.emit('message', {
      id: '',
      text: `${socket.id}が退出しました`,
    } as Message)
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
