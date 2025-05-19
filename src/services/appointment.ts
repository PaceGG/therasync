import { Appointment } from "../types/appointment";
import { mockAppointments } from "./mockData";

export const createAppointment = async (
  data: Omit<Appointment, "id" | "status">
): Promise<Appointment> => {
  const newApp: Appointment = {
    id: mockAppointments.length + 1,
    status: "BOOKED",
    ...data,
  };
  mockAppointments.push(newApp);
  return newApp;
};

export const updateAppointment = async (
  id: number,
  data: Partial<Appointment>
): Promise<Appointment> => {
  const idx = mockAppointments.findIndex((a) => a.id === id);
  if (idx >= 0) {
    mockAppointments[idx] = { ...mockAppointments[idx], ...data };
    return mockAppointments[idx];
  }
  throw new Error("Appointment not found");
};

export const getAppointmentsByPsychologist = async (): Promise<
  Appointment[]
> => {
  return mockAppointments;
};

export const getAppointmentsByClient = async (): Promise<Appointment[]> => {
  return mockAppointments;
};
