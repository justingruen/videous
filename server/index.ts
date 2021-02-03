import express, { Request, Response} from 'express'
import next from 'next'
import { Server, Socket } from 'socket.io'
import PORT from '../constants/port'
import { SocketEvent } from '../types/enums'
import { createServer } from 'http'
import {
  getRoom,
  addRoom,
  addUser,
  removeUser,
  getUser,
  getUsersInRoom, 
  checkRoomExists
} from './rooms'
import { 
  RoomData,
  User, 
  Message,
} from '../types/types'
import uuid from 'uuid-random'

const dev = process.env.NODE_ENV !== 'production'

const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler();

// TODO: Set up error handling for socket event if it returns a 404?

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

      // when a socket joins a room
      socket.on(SocketEvent.JOIN, ({username, room}: {username: string, room: string}, callback) => {
        console.log(`User ${username} connected to room ${room}`)

        // if get room returns null
        if (!checkRoomExists(room)) {
          addRoom(room, username, [], null)
        }

        let usersInRoomCount = getRoom(room)!.users.length

        addUser({ id: socket.id, username: username, room: room, userNumber: usersInRoomCount+1 })
        const user: User = { id: socket.id, username: username, room: room, userNumber: usersInRoomCount+1 }

        socket.join(room)

        const roomData: RoomData = getRoom(room)
        socket.to(user.room).emit(SocketEvent.STCROOMDATA, roomData)

        // const chatMessage: Message = {id: uuid(), author: 'Admin', message: `${user.username} has joined`}
        socket.to(room).emit(SocketEvent.STCMessage, {id: uuid(), author: 'Admin', message: `${user.username} has joined`})

        callback('Join success!', user, roomData) 
      })

      // when a user sends a message
      socket.on(SocketEvent.CTSMessage, ({chatMessage, room}: {chatMessage: Message, room: string}, callback) => {
        io.to(room).emit(SocketEvent.STCMessage, chatMessage)

        callback()
      })

      // when a socket leaves a room
      socket.on(SocketEvent.LEAVE, ({username, room}: {username: string, room: string}, callback) => {
        console.log(`User ${username} has left room ${room}!`)
        const user = getUser(room, socket.id)
        removeUser(user.room, socket.id)

        const roomData: RoomData = getRoom(room)
        socket.to(user.room).emit(SocketEvent.STCROOMDATA, roomData)
        
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