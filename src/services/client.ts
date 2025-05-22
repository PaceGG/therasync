import { Client } from "../types/client";
import { mockClients } from "./mockData";

export const getClientsByPsychologist = async (): Promise<Client[]> => {
  return mockClients;
};

export const searchClients = async (name: string): Promise<Client[]> => {
  return mockClients.filter((c) =>
    c.firstName.toLowerCase().includes(name.toLowerCase())
  );
};
