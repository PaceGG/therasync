import { User } from "../types/auth";
import { mockUsers } from "./mockData";

// export const getUser = async (): Promise<User> => {
//   return mockUsers;
// };

export const getUserById = async (id: number): Promise<User | null> => {
  return mockUsers.find((c) => c.id === id) || null;
};
