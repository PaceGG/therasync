import { api, getAuthHeaders } from "./index";
import { Appointment } from "../types/appointment";

export const createAppointment = async (data: Appointment) => {
  try {
    const headers = await getAuthHeaders();

    const response = await api.post("/appointments", data, { headers });
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании записи:", error);
  }
};

export const updateAppointment = async (
  id: number,
  data: Partial<Appointment>
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await api.put(`/appointments/${id}`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении записи:", error);
  }
};

export const getPsychologistAppointments = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await api.get("/appointments/psychologist", { headers });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении записей психолога:", error);
  }
};

export const getClientAppointments = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await api.get("/appointments/client", { headers });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении записей клиента:", error);
  }
};
