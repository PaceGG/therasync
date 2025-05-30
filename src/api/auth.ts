import { api, TOKEN_KEY } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchTokenFromYandex = async (yandexAccessToken: string) => {
  const response = await api.post("/auth/yandex", yandexAccessToken, {
    headers: { "Content-Type": "application/json" },
  });
  const jwt = response.data.token;
  await AsyncStorage.setItem(TOKEN_KEY, jwt);
  return jwt;
};

export const validateToken = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("Нет JWT токена");

  const response = await api.get("/auth/validate", {
    params: { token },
  });

  return response.data; // { clientId: "...", role: "..." }
};
