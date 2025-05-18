import { User } from '../types/auth';
import { mockUser } from './mockData';

export const getUser = async (): Promise<User> => {
  return mockUser;
};

export const updateUser = async (data: Partial<User>): Promise<User> => {
  Object.assign(mockUser, data);
  return mockUser;
};
