import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import Controls from '../controls/controls'
import { SocketEvent } from '../../types/enums'
import { Button as MuiButton, TextField } from '@material-ui/core'

function Player(props) {
  const { ogVideo, room, isHost, socket } = props
  const [videoInput, setVideoInput] = useState('')
  const [video, setvideo] = useState('')   // use the one ogvideo prop or this one too?
                                           // og would require reseding roomData each time
                                           // this has more stuff but less is sent
  const [canPlay, setCanPlay] = useState('')
  const [pause, setPause] = useState('Pause')
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    setvideo(ogVideo)
  }, [])

  // socketio listeners
  useEffect(() => {
    socket.on(SocketEvent.STCVIDEO, (video: string) => {
      setvideo(video)
    })

  }, [])

  function handleSubmit() {
    if (ReactPlayer.canPlay(videoInput))
      socket.emit(SocketEvent.CTSVIDEO, {videoInput: videoInput, room: room}, () => {
        console.log('New video sent')
      })
  }

  function handlePause() {
    if (pause === 'Pause') {
      setPause('Resume')
      setPlaying(false)
    } else {
      setPause('Pause')
      setPlaying(true)
    }
  }

  function onPlay() {
    console.log('Playing')
    setPause('Pause')
    setPlaying(true)
  }

  function onPause() {
    console.log('Pausing')
    setPause('Resume')
    setPlaying(false)
  }

  return (
    <div id='player'>
      <p>Currently playing: {video}</p>
      {isHost
        ? <div>
            <TextField style={{marginBottom: '10px'}} onChange={e => setVideoInput(e.target.value)} value={videoInput}/>
            <MuiButton type='submit' variant='contained' onClick={() => handleSubmit()}>
              Play Link
            </MuiButton>
          </div> 
        : <p>Only host can set the video!</p>
      }
      <div style={{height: '540px', width: '960px'}}>
        <ReactPlayer style={{background: 'rgba(0,0,0,.1)', marginTop: '10px', marginBottom: '10px'}} 
          url={video} 
          onPlay={() => onPlay()}
          onPause={() => onPause()}
          playing={playing} 
          controls 
          height='100%' 
          width='100%'/>
        <MuiButton style={{marginRight: '10px'}} type='submit' variant='contained' onClick={() => handlePause()}>
          {pause}
        </MuiButton>
        <MuiButton type='submit' variant='contained' onClick={() => setvideo(null)}>
          Stop
        </MuiButton>
      </div>
    </div>
  )
}

export default Player