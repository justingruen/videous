export interface User {
  id: string;
  username: string;
  room: string;
  userNumber: number;
}

export interface Room {
  id: string;
  host: string;
  video: string;
  users: Array<User>;
}