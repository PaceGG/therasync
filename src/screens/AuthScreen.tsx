import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import * as AuthSession from "expo-auth-session";

const discovery = {
  authorizationEndpoint: "https://oauth.yandex.com/authorize",
  tokenEndpoint: "https://oauth.yandex.com/token",
};

const clientId = "7f8716ae1c5349cd86942c81c036d5a5";

export default function AuthScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: [],
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

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
          console.log("Access Token:", res.accessToken);
          setToken(res.accessToken);

          // Получить данные пользователя
          return fetch("https://login.yandex.ru/info?format=json", {
            headers: {
              Authorization: `Bearer ${res.accessToken}`,
            },
          });
        })
        .then((res) => res.json())
        .then((data) => {
          console.log("User info:", data);
          setUserInfo(data);
        })
        .catch((err) => {
          console.error("Ошибка получения токена или данных:", err);
        });
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        disabled={!request}
        title="Войти через Яндекс"
        onPress={() => promptAsync({ useProxy: true })}
      />
      {token && <Text style={{ marginTop: 20 }}>Токен: {token}</Text>}
      {userInfo && (
        <View style={{ marginTop: 20 }}>
          <Text>Имя: {userInfo.first_name}</Text>
          <Text>Почта: {userInfo.default_email}</Text>
        </View>
      )}
    </View>
  );
}
