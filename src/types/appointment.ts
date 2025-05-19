export interface AppointmentData {
  date: string;
  startTime: string;
  endTime: string;
  clientId: number;
}

export interface Appointment extends AppointmentData {
  id: number;
}
