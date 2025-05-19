import { Appointment as AppointmentData } from "../types";

type Appointment = AppointmentData & { id: number };

const mockAppointments: Appointment[] = [
  {
    id: 1,
    date: "2025-06-13",
    startTime: "18:00",
    endTime: "19:00",
    clientId: 8,
  },
  {
    id: 2,
    date: "2025-06-14",
    startTime: "16:00",
    endTime: "17:00",
    clientId: 9,
  },
];

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

export const getAppointmentsByPsychologist = async (): Promise<
  Appointment[]
> => {
  return mockAppointments;
};

export const getAppointmentsByClient = async (): Promise<Appointment[]> => {
  return mockAppointments;
};
