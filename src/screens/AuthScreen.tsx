import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "../api";
import Header from "../components/Header";
import { Colors } from "../constants/colors";

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

          const realName = profile.real_name.split(" ");
          const userData = {
            id: profile.id,
            login: profile.login,
            displayName: profile.display_name,
            realName: profile.real_name,
            firstName: realName[0],
            lastName: realName[1],
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
    <View>
      <View style={{ paddingBottom: 15 }}>
        <Header />
      </View>
      <ImageBackground source={require("../assets/background.png")}>
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => promptAsync({ useProxy: true } as any)}
            activeOpacity={0.8}
          >
            <View style={styles.content}>
              <Text style={styles.text}>Войти через Яндекс</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
    borderRadius: 4,
  },
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
});
