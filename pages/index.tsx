import Head from 'next/head'
import { useState } from 'react'
import { Button as MuiButton, TextField } from '@material-ui/core'
import uuid from 'uuid-random'
import Link from 'next/link'
import Router from 'next/router'
import { makeStyles } from '@material-ui/core' 
import { useRouter } from 'next/router'

const useStyles = makeStyles(() => ({
  divMain: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: '100vh',
  }
}))

export default function Index() {

  const [uid, setUid] = useState<string>('UID Here')
  const [inputUid, setInputUid] = useState<string>(null) 
  const [username, setUsername] = useState<string>(null)
  const router = useRouter()
  const classes = useStyles()

  const handleSubmit = (event: any) => {
    event.preventDefault()
    if (uuid.test(inputUid) && username) {
      router.push({
        pathname: '/[room]',
        query: { username: username, room: inputUid }
      })
    }
  }

  return (
    <div className={ classes.divMain }>
      <Head>
        <title>VideoUs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/about">
          <a>About App</a>
        </Link>

        <p>Press the button to generate a new uid!</p>

        <MuiButton onClick={() => setUid(uuid())} variant='contained'>
          Generate new Uid
        </MuiButton>

        <form onSubmit={handleSubmit} noValidate autoComplete='off'>
          <TextField id='username-input' label='Username' fullWidth 
            onChange={e => setUsername(e.target.value)} 
          />
          <TextField id='roomcode-input' label='Room Code' fullWidth 
            onChange={e => setInputUid(e.target.value)} 
          />
          <MuiButton type='submit' variant='contained'>
            Enter room
          </MuiButton>
        </form>

        <p>{uid}</p>
      </main>
    </div>
  )
}
