import { Client } from "../types/client";
import { mockClients } from "./mockData";

export const getClientsByPsychologist = async (): Promise<Client[]> => {
  return mockClients;
};

export const deleteClient = async (id: number): Promise<void> => {
  const index = mockClients.findIndex((c) => c.id === id);
  if (index !== -1) {
    mockClients.splice(index, 1);
  }
};

export const searchClients = async (name: string): Promise<Client[]> => {
  return mockClients.filter((c) =>
    c.firstName.toLowerCase().includes(name.toLowerCase())
  );
};
