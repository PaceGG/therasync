export interface ChatRoom {
  id: number;
  participant1Id: number;
  participant2Id: number;
}
export interface Message {
  id: number;
  roomId: number;
  senderId: number;
  text: string;
  timestamp: string;
}
