export interface User {
  id: string;
  username: string;
  room: string;
  userNumber: number;
}

export interface RoomData {
  id: string;
  host: string;
  users: Array<User>;
  video: string | null;
  
}

export interface Message {
  id: string;
  author: string;
  message: string;
}