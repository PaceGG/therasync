import {
  Text,
  Image,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { ScrollView, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import UserOption from "../components/UserOption";
import ClientTask from "../components/ClientTask";
import ClientsList from "./ClientsList";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  logout: () => void;
};

export default function ProfileScreen({ logout }: Props) {
  const [avatarUri, setAvatarUri] = useState<string>("");
  const [realName, setRealName] = useState("Имя не найдено");
  const [screen, setScreen] = useState<string>("profile");
  const isClient = true;

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem("YANDEX_PROFILE");
      if (json) {
        try {
          const profile = JSON.parse(json);
          setRealName(profile.realName || "Пользователь");
          if (profile.avatarUrl) {
            setAvatarUri(profile.avatarUrl);
          }
        } catch (e) {
          console.warn("Ошибка чтения профиля:", e);
        }
      }
    })();
  }, []);

  return (
    <>
      {screen !== "profile" && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("profile")}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.icon} />
        </TouchableOpacity>
      )}
      {screen === "profile" && (
        <ImageBackground
          source={require("../assets/background.png")}
          style={{ height: "100%" }}
        >
          <ScrollView style={styles.mainContainer}>
            {/* user header */}
            <View style={styles.userHeader}>
              <Image
                source={
                  avatarUri
                    ? { uri: avatarUri }
                    : require("../assets/noavatar.png")
                }
                style={styles.avatar}
              />
              <Text style={{ fontSize: 20 }}>{realName}</Text>
            </View>

            {/* user options */}
            <UserOption
              iconName="person"
              title="Личные данные"
              func={() => {}}
            />
            <UserOption iconName="settings" title="Настройки" func={() => {}} />
            {isClient && (
              <UserOption
                iconName={"people"}
                title="Список клиентов"
                func={() => setScreen("ClientsList")}
              />
            )}
            {isClient && (
              <UserOption
                iconName={"history"}
                title="История консультаций и заданий"
                func={() => {}}
              />
            )}
            <UserOption
              iconName={"logout"}
              title="Выйти из аккаунта"
              func={logout}
            />
          </ScrollView>
        </ImageBackground>
      )}
      {screen === "ClientsList" && <ClientsList />}
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: -45,
    left: 25,
    zIndex: 300,
  },
  mainContainer: {
    // backgroundColor: Colors.lightContainerBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  userHeader: {
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
    marginBottom: 28,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 120,
  },
});
