import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/auth";
import { mockUsers } from "./mockData";

export const getProfile = async () => {
  const yandexData = await AsyncStorage.getItem("YANDEX_PROFILE");
  if (yandexData) {
    const profile = JSON.parse(yandexData);
    return profile;
  } else {
    throw new Error("Не удалось загрузить профиль");
  }
};

export const getUserId = async () => {
  const profile = await getProfile();
  return Number(profile.id);
};

export const getUser = async (): Promise<User> => {
  const userId = await getUserId();
  const user = await getUserById(userId);
  return user;
};

export const getUserById = async (id: number): Promise<User> => {
  const user = mockUsers.find((user) => user.id === id);
  if (user) return user;
  throw new Error("USER_NOT_FOUND");
};

export const putUser = async (updateData: Partial<User>): Promise<User> => {
  const userId = await getUserId();

  const userIndex = mockUsers.findIndex((u) => u.id === userId);

  const user = mockUsers[userIndex];
  const updated = { ...user, ...updateData };
  mockUsers[userIndex] = updated;

  return updated;
};
