import { ChatRoom, Message } from "../types/chat";
import { mockChatRooms, mockMessages } from "./mockData";

export const createChatRoom = async (
  participant1Id: number,
  participant2Id: number
): Promise<ChatRoom> => {
  const newRoom = {
    id: mockChatRooms.length + 1,
    participant1Id,
    participant2Id,
  };
  mockChatRooms.push(newRoom);
  return newRoom;
};

export const getChatRooms = async (userId: number): Promise<ChatRoom[]> => {
  return mockChatRooms.filter(
    (r) => r.participant1Id === userId || r.participant2Id === userId
  );
};

export const getMessages = async (roomId: number): Promise<Message[]> => {
  return mockMessages.filter((m) => m.roomId === roomId);
};

export const sendMessage = async (
  roomId: number,
  senderId: number,
  text: string
): Promise<Message> => {
  const newMessage: Message = {
    id: mockMessages.length + 1,
    roomId,
    senderId,
    text,
    timestamp: new Date().toISOString(),
  };
  mockMessages.push(newMessage);
  return newMessage;
};
