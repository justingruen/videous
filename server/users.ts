import { User } from '../types/types'

const users: Array<User> = []

// Add user to list
const addUser = (newUser: User) => {
  const user: User = newUser

  users.push(user)

  return { user }
}

// Remove user from list
const removeUser = (id: string) => {
  const index = users.findIndex(user => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

// Retrieve a user
const getUser = (id: string) => {
  return users.find(user => user.id === id)
}

// Retrieve all users in a room
const getUsersInRoom = (room: string) => {
  return users.filter(user => user.room === room)
}

export { addUser, removeUser, getUser, getUsersInRoom }