import { Task } from '../types/task';
import { mockTasks } from './mockData';

export const createTask = async (data: Omit<Task, 'id' | 'isComplete'>): Promise<Task> => {
  const newTask: Task = { id: mockTasks.length + 1, isComplete: false, ...data };
  mockTasks.push(newTask);
  return newTask;
};

export const getTasksByClient = async (clientId: number): Promise<Task[]> => {
  return mockTasks.filter(t => t.clientId === clientId);
};

export const getActiveTasks = async (): Promise<Task[]> => {
  const today = new Date().toISOString().split('T')[0];
  return mockTasks.filter(t => t.dueDate >= today && !t.isComplete);
};
