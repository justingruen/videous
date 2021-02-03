export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  JOIN = 'join',
  LEAVE = 'leave',
  STCROOMDATA = 'stcroomdata',
  CTSMessage = 'ctsmessage',
  STCMessage = 'stcmessage'
}

// stc = server to client
// cts = client to server