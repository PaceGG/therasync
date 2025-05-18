import api from './index';
import { User } from '../types/auth';

export const getUser = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUser = async (data: Partial<User>): Promise<User> => {
  const response = await api.put('/users', data);
  return response.data;
};
