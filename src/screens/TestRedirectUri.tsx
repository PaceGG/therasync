import React, { useEffect } from "react";
import { Text, View } from "react-native";
import * as AuthSession from "expo-auth-session";

export default function TestRedirectUri() {
  useEffect(() => {
    const redirectUri = AuthSession.makeRedirectUri({ scheme: "therasync" });
    console.log("Redirect URI:", redirectUri);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Проверь консоль на redirectUri</Text>
    </View>
  );
}
