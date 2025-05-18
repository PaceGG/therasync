import api from './index';
import { ChatRoom, Message } from '../types/chat';

export const createChatRoom = async (participant1Id: number, participant2Id: number): Promise<ChatRoom> => {
  const response = await api.post('/chat/rooms', { participant1Id, participant2Id });
  return response.data;
};

export const getChatRooms = async (userId: number): Promise<ChatRoom[]> => {
  const response = await api.get(`/chat/rooms?userId=${userId}`);
  return response.data;
};

export const getMessages = async (roomId: number): Promise<Message[]> => {
  const response = await api.get(`/chat/rooms/${roomId}/messages`);
  return response.data;
};
