export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  JOIN = 'join',
  LEAVE = 'leave',
  STCROOMDATA = 'stcroomdata',
  CTSMESSAGE = 'ctsmessage',
  STCMESSAGE = 'stcmessage',
  CTSVIDEO = 'ctsvideo',
  STCVIDEO = 'stcvideo'
}

// stc = server to client
// cts = client to server