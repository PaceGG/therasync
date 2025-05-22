import React, { useEffect, useState } from "react";
import { Button, Text, View, ActivityIndicator } from "react-native";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "../api";

const discovery = {
  authorizationEndpoint: "https://oauth.yandex.com/authorize",
  tokenEndpoint: "https://oauth.yandex.com/token",
};

const clientId = "7f8716ae1c5349cd86942c81c036d5a5";

type Props = {
  setMainToken: (token: string) => void;
};

export default function AuthScreen({ setMainToken }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true } as any);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: [],
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  // Загрузка токена при старте
  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY)
      .then((storedToken) => {
        if (storedToken) {
          setToken(storedToken);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Обработка авторизации
  useEffect(() => {
    if (response?.type === "success") {
      const code = response.params.code;

      AuthSession.exchangeCodeAsync(
        {
          clientId,
          code,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier!,
          },
        },
        discovery
      )
        .then((res) => {
          const accessToken = res.accessToken;
          setToken(accessToken);
          AsyncStorage.setItem(TOKEN_KEY, accessToken);
          setMainToken(accessToken);
        })
        .catch((err) => {
          console.error("Ошибка получения токена:", err);
        });
    }
  }, [response]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        disabled={!request}
        title="Войти через Яндекс"
        onPress={() => promptAsync({ useProxy: true } as any)}
      />
    </View>
  );
}
