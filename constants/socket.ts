import {createContext} from 'react'
import { io, Socket } from 'socket.io-client'
import PORT from '../constants/port'

export const socket: Socket = io(`localhost:${PORT}`)
export const SocketContext = createContext(socket)