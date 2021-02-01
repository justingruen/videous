import express, { Request, Response} from 'express'
import next from 'next'
import { Server, Socket } from 'socket.io'
import PORT from '../constants/port'
import { SocketEvent } from '../types/enums'
import { createServer } from 'http'
import { 
  addUser, 
  removeUser,
  getUser,
  getUsersInRoom, 
} from './users'
import { 
  User, 
} from '../types/types'
import uuid from 'uuid-random'

const dev = process.env.NODE_ENV !== 'production'

const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler();

(async () => {
  try {
    await nextApp.prepare()
    const app: express.Application = express()

    const server = createServer(app)
    const io: Server = new Server(server)

    app.all('*', (req: Request, res: Response) => {
      return nextHandler(req, res)
    })

    // whenever a user connects on port 3000 via
    // a websocket, log that a user has connected
    io.on("connection", (socket: Socket) => {
      console.log(`Socket with ID of ${socket.id} has joined!`)

      // when a new socket connects to a room
      socket.on(SocketEvent.JOIN, ({username, room}: {username: string, room: string}, callback) => {
        console.log(`User ${username} connected to room ${room}`)

        let usersInRoomCount = getUsersInRoom(room).length

        let { user } = addUser({ id: socket.id, username: username, room: room, userNumber: usersInRoomCount+1 })

        socket.join(user.room)

        console.log(user)

        callback('Join success!', user) 
      })

      // when a socket disconnects
      socket.on(SocketEvent.LEAVE, ({username, room}: {username: string, room: string}, callback) => {
        console.log(`User ${username} has left room ${room}!`)
        const user = removeUser(socket.id)
        
        if (user) {

        }

        callback('Leave success!')
      })

      // when a socket disconnects
      socket.on(SocketEvent.DISCONNECT, () => {
        console.log(`Socket with ID of ${socket.id} disconnected!`)
      })
    });

    server.listen(PORT, (err?: any) => {
      if (err) throw err
      console.log(`> Ready on localhost:${PORT} - env ${process.env.NODE_ENV}`)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()



//------------------------------------------------------------------------------

// Both contain different methods of starting an express server
//    This uses app = express(); http = createServer(app); http.listen(port)
//    Other uses server = express(); server.listen(port, ...)

// Both contain different methods of receiving get requests
//    This uses app.get('*', handler thing)
//    Other uses server.all('*', handler thing)

// Note 1: server.listen(port, ...) is a shortcut for [http = createServer(app) and http.listen(port)]
// Note 2: app.get('*')
// Note 3: What exactly is app.use(json())?
// Note 4: 