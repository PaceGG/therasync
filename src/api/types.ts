export interface AppointmentRequest {
  date: string;
  startTime: string;
  endTime: string;
  psychologistId: string;
  clientId: string;
}

export interface Appointment extends AppointmentRequest {
  id: string;
}
