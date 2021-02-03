import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { User, RoomData } from '../types/types'
import PORT from '../constants/port'
import Chatbox from '../components/chat/chatbox'

import { SocketContext } from '../constants/socket'

import { SocketEvent } from '../types/enums'
import { Socket } from 'socket.io-client'


function Room() {
  const router = useRouter()
  const { username, room } = router.query
  const [user, setUser] = useState<User>(null)
  const socket = useContext<Socket>(SocketContext)
  const [roomData, setroomData] = useState<RoomData>(null)

  function LeaveEvent() {
    {username && room &&  // TODO: test adding var, and fixing leaveevent showing twice
      socket.emit(SocketEvent.LEAVE, { username, room }, (successMsg: string) => {
        console.log(successMsg)
      })
    }
  }

  // socket io joining and leaving room
  useEffect(() => {
    {username && room &&
      socket.emit(SocketEvent.JOIN, { username, room }, (successMsg: string, user: User, data: RoomData) => {
        setUser(user)
        setroomData(data)
        console.log(successMsg)
      })
    }

    window.addEventListener('beforeunload', LeaveEvent)

    return () => {
      {username && room &&
        socket.emit(SocketEvent.LEAVE, { username, room }, (successMsg: string) => {
          console.log(successMsg)
        })
      }
      window.removeEventListener('beforeunload', LeaveEvent)
    }
    
  }, [router.query])

  // socketio listeners
  useEffect(() => {
    socket.on(SocketEvent.STCROOMDATA, (roomData: RoomData) => {
      setroomData(roomData)
    })
  })

  return (
    <div>
      <Head>
        <title>React Player</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div id='nav'>
          <Link href='/'>
            Home
          </Link>
        </div>
        <hr />
        <div id='content'>
          <p>Room: {room}</p>
          <p>Username: {username}</p>
        </div>
        {roomData   // TODO: better to pass socket as a prop or call context again in child?
          ? <Chatbox host={roomData.host} users={roomData.users} username={user.username} socket={socket}/>
          : null
        }
      </main>
    </div>
  )
}

export default Room

// 1. client joins
// 2. server sends back a cookie with sessionID
// 3. in client, store in session storage
// 4. 


// Local storage -> No expiry, must be deleted. Stays across multiple tabs
// Session storage -> Lifetime of single tab. Exists by per-tab basis
// Permanent Cookie -> Developer-set expiry dates. Stays across multiple tabs
// Session cookie -> Lifetime of browser window, stays across multiple tabs

// Cookies -> Contains Path 'prop'. Default is URL that sent the Set-Cookie Header
//            ie. domain.com/test -> also works for /test/any-path
