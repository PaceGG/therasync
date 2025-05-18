import api from './index';
import { Client } from '../types/client';

export const getClientsByPsychologist = async (): Promise<Client[]> => {
  const response = await api.get('/clients/by-psychologist');
  return response.data;
};

export const searchClients = async (name: string): Promise<Client[]> => {
  const response = await api.get(`/clients/search?name=${name}`);
  return response.data;
};
