import { AppointmentData, Appointment } from "../types";
import { mockAppointments } from "./mockData";

export const createAppointment = async (
  data: AppointmentData
): Promise<Appointment> => {
  const newAppointment = { id: Date.now(), ...data };
  mockAppointments.push(newAppointment);

  return newAppointment;
};

export const updateAppointment = async (
  id: number,
  data: AppointmentData
): Promise<Appointment> => {
  const index = mockAppointments.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error("Запись не найдена");
  }

  mockAppointments[index] = { id, ...data };
  return mockAppointments[index];
};

export const getPsychologistAppointments = async (): Promise<Appointment[]> => {
  return mockAppointments;
};

export const getClientAppointments = async (): Promise<Appointment[]> => {
  return mockAppointments;
};
