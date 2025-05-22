import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = axios.create({ baseURL: "http://localhost:8000/api" });

export const TOKEN_KEY = "yandex_access_token";

export const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("authToken");
  if (!token) {
    throw new Error("Токен не найден");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
