import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

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
  socket.on('message', newMessage => {
    console.log('message come')
    console.log(newMessage)
    io.emit('message', newMessage);
  })
})

server.listen(PORT, () => {
  console.log('Server Start!')
})