import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import Navigation from "./src/navigation";
import YandexAuthScreen from "./src/screens/AuthScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "./src/api";

export default function App() {
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((storedToken) => {
      if (storedToken) {
        setToken(storedToken);
      }
    });
  }, [token]);

  const setMainToken = (token: string) => {
    setToken(token);
  };

  const logout = () => {
    AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return (
    <>
      {!token ? (
        <YandexAuthScreen setMainToken={setMainToken} />
      ) : (
        <Navigation logout={logout} />
      )}
    </>
    // <Navigation logout={logout} />
  );
}
