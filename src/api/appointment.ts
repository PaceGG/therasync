import api from './index';
import { Appointment } from '../types/appointment';

export const createAppointment = async (data: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
  const response = await api.post('/appointments', data);
  return response.data;
};

export const updateAppointment = async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
  const response = await api.put(`/appointments/${id}`, data);
  return response.data;
};

export const getAppointmentsByPsychologist = async (): Promise<Appointment[]> => {
  const response = await api.get('/appointments/psychologist');
  return response.data;
};

export const getAppointmentsByClient = async (): Promise<Appointment[]> => {
  const response = await api.get('/appointments/client');
  return response.data;
};
