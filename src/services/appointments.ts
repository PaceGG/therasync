const mockAppointments = [
  {
    id: 1,
    date: "2025-05-18",
    startTime: "14:30:00",
    endTime: "14:30:00",
    status: "BOOKED",
    psychologistId: "psy1",
    clientId: "client1",
  },
];

export const getAppointmentsByPsychologist = async (id: string) => {
  return mockAppointments.filter((a) => a.psychologistId === id);
};

export const getAppointmentsByClient = async (id: string) => {
  return mockAppointments.filter((a) => a.clientId === id);
};

export const createAppointment = async (data: {
  date: string;
  startTime: string;
  endTime: string;
  psychologistId: string;
  clientId: string;
}) => {
  const id = mockAppointments.length + 1;
  const newAppt = { id, status: "BOOKED", ...data };
  mockAppointments.push(newAppt);
  return newAppt;
};

export const updateAppointment = async (id: number, data: any) => {
  const index = mockAppointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    mockAppointments[index] = { ...mockAppointments[index], ...data };
    return mockAppointments[index];
  }
  return null;
};
