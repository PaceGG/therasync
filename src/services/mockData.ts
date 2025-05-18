import { ChatRoom, Message } from "../types/chat";
import { User } from "../types/auth";
import { Client } from "../types/client";
import { Appointment } from "../types/appointment";
import { Task } from "../types/task";

export const mockChatRooms: ChatRoom[] = [
  {
    id: 1,
    participant1Id: 1,
    participant2Id: 2,
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

export const mockUser: User = {
  id: 1,
  firstName: "Вася",
  lastName: "Пупкин",
  role: "CLIENT",
};

export const mockClients: Client[] = [
  {
    id: 1,
    firstName: "Анна",
    lastName: "Иванова",
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    date: "2025-05-20",
    startTime: "10:00",
    endTime: "11:00",
    status: "BOOKED",
    clientId: 1,
    psychologistId: 1,
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
