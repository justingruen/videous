import { RoomData, User } from '../types/types'

const rooms: Array<RoomData> = []

const addRoom = (id: string, host: string, users: Array<User>, video: null) => {

  const room: RoomData = {id, host, users, video}

  rooms.push(room)

  //roomId: string, host: string, users: Array<User>, video: string
}

const addUser = (user: User): void => {
  const index = rooms.findIndex(room => room.id === user.room)
  rooms[index].users.push(user)
}

const removeUser = (roomId: string, userId: string): void => {
  const roomIndex = rooms.findIndex(room => room.id === roomId)
  const userIndex = rooms[roomIndex].users.findIndex(user => user.id === userId)
  rooms[roomIndex].users.splice(userIndex, 1)

  if (rooms[roomIndex].users.length === 0) {
    removeRoom(roomIndex)
    return
  }

  updateUserNumbers(roomIndex, userIndex)

  if (userIndex === 0) {
    updateHost(roomIndex, rooms[roomIndex].users[0].username)
  }
}

const removeRoom = (roomIndex: number): void => {
  rooms.splice(roomIndex, 1)
}

const updateUserNumbers = (roomIndex: number, userIndex: number): void => {
  rooms[roomIndex].users.forEach((user, index) =>  {
    if (index >= userIndex) {
      rooms[roomIndex].users[index] = {...user, userNumber: user.userNumber - 1}
    }
  })
} 

const updateHost = (roomIndex: number, username: string): void => {
  rooms[roomIndex].host = username
}

const getRoom = (roomId: string): RoomData => {
  return rooms.find(room => room.id === roomId)!
}

const checkRoomExists = (roomId: string): boolean => {
  const index = rooms.findIndex(room => room.id === roomId)
  if (index === -1) {
    return false
  } else {
    return true
  }
}

// Retrieve a user
const getUser = (roomId: string, userId: string): User => {
  return rooms.find(room => room.id === roomId)!.users.find(user => user.id === userId)!
}

// Retrieve all users in a room
const getUsersInRoom = (roomId: string) => {
  return rooms.find(room => room.id === roomId)!.users
}

export { addRoom, addUser, removeUser, getRoom, getUser, getUsersInRoom, checkRoomExists }