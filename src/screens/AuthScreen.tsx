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
        })
        .catch((err) => {
          console.error("Ошибка получения токена:", err);
        });
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        disabled={!request}
        title="Войти через Яндекс"
        onPress={() => promptAsync({ useProxy: true } as any)}
      />
      {token && <Text>Токен: {token}</Text>}
    </View>
  );
}
