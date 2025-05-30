import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import { Colors } from "../constants/colors";
import { api, TOKEN_KEY } from "../api";

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

  // Загрузка токена при запуске
  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY)
      .then((storedToken) => {
        if (storedToken) {
          setToken(storedToken);
          setMainToken(storedToken);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Обработка ответа после авторизации
  useEffect(() => {
    const fetchTokenAndUser = async () => {
      try {
        if (response?.type === "success" && response.params.code) {
          const res = await AuthSession.exchangeCodeAsync(
            {
              clientId,
              code: response.params.code,
              redirectUri,
              extraParams: {
                code_verifier: request?.codeVerifier!,
              },
            },
            discovery
          );

          const yandexAccessToken = res.accessToken;

          if (!yandexAccessToken) {
            console.error("Токен от Яндекса не получен:", res);
            return;
          }

          await AsyncStorage.setItem(TOKEN_KEY, yandexAccessToken);
          setToken(yandexAccessToken);
          setMainToken(yandexAccessToken);

          const profileResponse = await fetch(
            "https://login.yandex.ru/info?format=json",
            {
              headers: {
                Authorization: `OAuth ${yandexAccessToken}`,
              },
            }
          );
          const profile = await profileResponse.json();

          const avatarUrl = profile.is_avatar_empty
            ? null
            : `https://avatars.mds.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`;

          const realName = profile.real_name?.split(" ") || [];
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

          await AsyncStorage.setItem(
            "YANDEX_PROFILE",
            JSON.stringify(userData)
          );

          // Валидируем токен через backend
          try {
            const validateResponse = await api.get("/auth/validate", {
              params: { token: yandexAccessToken },
            });
            console.log("Валидирован:", validateResponse.data);
          } catch (err) {
            console.error("Ошибка валидации токена:", err);
          }
        }
      } catch (err) {
        console.error("Ошибка авторизации:", err);
      }
    };

    fetchTokenAndUser();
  }, [response]);

  if (loading) {
    return (
      <View style={styles.center}>
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
        <View style={styles.wrapper}>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
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
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
});
