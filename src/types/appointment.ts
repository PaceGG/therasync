export interface Appointment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "BOOKED" | "CONFIRMED" | "CANCELLED";
  clientId: number;
  psychologistId: number;
}
