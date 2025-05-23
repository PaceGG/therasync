import { Client } from "../types/client";
import { mockClients } from "./mockData";
import { createChatRoom } from "./chat";
import { getUserId } from "./auth";

export const getClientsByPsychologist = async (): Promise<Client[]> => {
  return mockClients;
};

export const addClient = async (client: Client) => {
  const exists = mockClients.some((c) => c.id === client.id);
  if (exists) throw new Error("CLIENT_IS_EXISTS");
  mockClients.push(client);
  const userId = await getUserId();
  createChatRoom(client.id, userId);
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
