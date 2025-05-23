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
          setMainToken(accessToken);

          // Сохраняем токен
          AsyncStorage.setItem(TOKEN_KEY, accessToken);

          // Загружаем данные профиля
          return fetch("https://login.yandex.ru/info?format=json", {
            headers: {
              Authorization: `OAuth ${accessToken}`,
            },
          });
        })
        .then((res) => res.json())
        .then((profile) => {
          const avatarUrl = profile.is_avatar_empty
            ? null
            : `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-retina-200`;

          const userData = {
            id: profile.id,
            login: profile.login,
            displayName: profile.display_name,
            realName: profile.real_name,
            email: profile.default_email,
            avatarUrl,
          };

          // Сохраняем профиль
          return AsyncStorage.setItem(
            "YANDEX_PROFILE",
            JSON.stringify(userData)
          );
        })
        .catch((err) => {
          console.error("Ошибка при получении профиля:", err);
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
