import { ChatRoom, Message } from "../types/chat";
import { User } from "../types/auth";
import { Client } from "../types/client";
import { AppointmentData } from "../types/appointment";
import { Task } from "../types/task";

export const mockChatRooms: ChatRoom[] = [
  {
    id: 1,
    participant1Id: 1,
    participant2Id: 2,
  },
  {
    id: 2,
    participant1Id: 1709255700,
    participant2Id: 13,
  },
];

export const mockMessages: Message[] = [
  {
    id: 1,
    roomId: 1,
    senderId: 1,
    text: "Hello",
    timestamp: new Date().toISOString(),
  },
];

export const mockUsers: User[] = [
  {
    id: 13,
    firstName: "Вася",
    lastName: "Пупкин",
    role: "CLIENT",
  },
  {
    id: 1709255700,
    firstName: "Юрий",
    lastName: "Буторин",
    role: "PSYCHOLOGIST",
  },
];

export const mockClients: Client[] = [
  { id: 1, firstName: "Анна", lastName: "Иванова" },
  { id: 2, firstName: "Игорь", lastName: "Смирнов" },
  { id: 3, firstName: "Мария", lastName: "Кузнецова" },
  { id: 4, firstName: "Дмитрий", lastName: "Попов" },
  { id: 5, firstName: "Елена", lastName: "Новикова" },
  { id: 6, firstName: "Алексей", lastName: "Соколов" },
  { id: 7, firstName: "Ольга", lastName: "Лебедева" },
  { id: 8, firstName: "Николай", lastName: "Козлов" },
  { id: 9, firstName: "Татьяна", lastName: "Морозова" },
  { id: 10, firstName: "Сергей", lastName: "Петров" },
  { id: 11, firstName: "Find", lastName: "Me" },
  {
    id: 12,
    firstName: "ОченьбольшоеимяОченьбольшоеимяОченьбольшоеимя",
    lastName: "ОченьбольшоеимяОченьбольшоеимяОченьбольшоеимя",
  },
];

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Тестовое задание",
    taskText: "Описание",
    clientId: 1,
    dueDate: "2025-05-25",
    isComplete: false,
  },
];
