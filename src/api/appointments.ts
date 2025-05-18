import api from "./index";
import { Appointment, AppointmentRequest } from "./types";

export const createAppointment = async (
  data: AppointmentRequest
): Promise<Appointment> => {
  const response = await api.post("/appointments", data);
  return response.data;
};

export const updateAppointment = async (
  id: string,
  data: AppointmentRequest
): Promise<Appointment> => {
  const response = await api.put(`/appointments/${id}`, data);
  return response.data;
};

export const getAppointmentsByPsychologist = async (
  psychologistId: string
): Promise<Appointment[]> => {
  const response = await api.get(
    `/appointments/psychologist/${psychologistId}`
  );
  return response.data;
};

export const getAppointmentsByClient = async (
  clientId: string
): Promise<Appointment[]> => {
  const response = await api.get(`/appointments/client/${clientId}`);
  return response.data;
};
