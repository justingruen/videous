import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { User } from '../types/types'
import PORT from '../constants/port'

import { SocketContext } from '../constants/socket'

import { SocketEvent } from '../types/enums'


export default function Room() {
  const router = useRouter()
  const { username, room } = router.query
  const [user, setUser] = useState<User>(null)
  const socket = useContext(SocketContext)

  // socket io joining and leaving room
  useEffect(() => {
    {username && room &&
      socket.emit(SocketEvent.JOIN, { username, room }, (successMsg: string, user: User) => {
        setUser(user)
        console.log(successMsg)
      })
    }

    window.addEventListener('beforeunload', () => {
      {username && room &&
        socket.emit(SocketEvent.LEAVE, { username, room }, (successMsg: string) => {
          console.log(successMsg)
        })
      }
    })

    return () => {
      {username && room &&
        socket.emit(SocketEvent.LEAVE, { username, room }, (successMsg: string) => {
          console.log(successMsg)
        })
      }
    }

    // return function cleanupListener() {
    //   window.removeEventListener('resize', handleResize)
    // }
    
  }, [router.query])

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
      </main>
    </div>
  )
}

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
