import api from './index';
import { Task } from '../types/task';

export const createTask = async (data: Omit<Task, 'id' | 'isComplete'>): Promise<Task> => {
  const response = await api.post('/tasks', data);
  return response.data;
};

export const getTasksByClient = async (clientId: number): Promise<Task[]> => {
  const response = await api.get(`/tasks/client/${clientId}`);
  return response.data;
};

export const getActiveTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks/active');
  return response.data;
};
