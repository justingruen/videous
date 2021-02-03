import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import uuid from 'uuid-random'
import { User, Message } from '../../types/types'
import { SocketEvent } from '../../types/enums'
import Controls from '../controls/controls'
import { Theme, makeStyles } from '@material-ui/core'

const useStyles = makeStyles<Theme>((theme) => ({
  submit: {
    margin: theme.spacing(3,0,2),
  },
}))

function Chatbox(props) {
  const { host, users, username, socket }: {host: string, users: Array<User>, username: string, socket: Socket} = props
  const [messages, setmessages] = useState<Array<Message>>([])
  const [message, setmessage] = useState<string>('')
  const classes = useStyles()

  useEffect(() => {
    // receives incoming messages
    socket.on(SocketEvent.STCMessage, (chatMessage: Message) => {
      setmessages(messages => [...messages, chatMessage])
    })
  }, [])

  useEffect(() => {
    console.log(messages)
  }, [messages])

  // sends out messages
  function sendMessage(e) {
    e.preventDefault()

    if(message) {
      socket.emit(SocketEvent.CTSMessage, { chatMessage: {id: uuid(), author: username, message: message}, room: users[0].room }, () => setmessage(''))
    }
  }

  return (
    <div id='chatbox'>
      <p>Host: {host}</p>
      <p>User Count: {users.length}, Users:</p>
      {users.map(user => (
        <p key={uuid()}>{user.username}</p>
      ))}
      <hr />
      {messages.map(message => (
        <p key={message.id}>{message.author}: {message.message}</p>
      ))}
      <br />
      <br />
      <div id='input'>
        <form onSubmit={sendMessage} noValidate autoComplete='off'>
          <Controls.Input
            name='message'
            label='Message'
            margin='normal'
            value={message}
            onChange={e => setmessage(e.target.value)}
            // error={0}
            fullWidth
          />
          <Controls.Button
            type='submit'
            text='Send'
            variant='contained'
            color='primary'
            fullWidth
            className={classes.submit}
          />
        </form>
      </div>
    </div>
  )
}

export default Chatbox