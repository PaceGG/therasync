import {
  Text,
  Image,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
  BackHandler,
} from "react-native";
import { ScrollView, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import UserOption from "../components/UserOption";
import ClientTask from "../components/ClientTask";
import ClientsList from "./ClientsList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserInfoScreen from "./UserInfoScreen";
import { getUser } from "../services/auth";
import { User } from "../types";
import AppointmentHistoryScreen from "./AppointmentsHistoryScreen";

type Props = {
  logout: () => void;
};

export default function ProfileScreen({ logout }: Props) {
  const [avatarUri, setAvatarUri] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [screen, setScreen] = useState<string>("profile");
  // const isPsychologist = true;
  const [isPsychologist, setIsPsychologist] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (!user) logout();
      setUser(user);
      setIsPsychologist(user.role === "PSYCHOLOGIST");

      try {
        const yandexJson = await AsyncStorage.getItem("YANDEX_PROFILE");
        if (yandexJson) {
          const profile = JSON.parse(yandexJson);
          if (profile.avatarUrl) {
            setAvatarUri(profile.avatarUrl);
          }
        }
      } catch (e) {
        console.warn("Ошибка чтения профиля:", e);
      }

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          handleBackButton();
          return true;
        }
      );
    })();
  }, []);

  if (!user) {
    return;
  }

  const handleBackButton = async () => {
    setScreen("profile");
    const user = await getUser();
    setUser(user);
  };

  return (
    <>
      {screen !== "profile" && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
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
              <Text style={{ fontSize: 20 }}>
                {user.firstName} {user.lastName}
              </Text>
            </View>

            {/* user options */}
            <UserOption
              iconName="person"
              title="Личные данные"
              func={() => setScreen("UserInfo")}
            />
            {/* <UserOption iconName="settings" title="Настройки" func={() => {}} /> */}
            {isPsychologist && (
              <UserOption
                iconName={"people"}
                title="Список клиентов"
                func={() => setScreen("ClientsList")}
              />
            )}
            {isPsychologist && (
              <UserOption
                iconName={"history"}
                title="История консультаций"
                func={() => setScreen("AppointmentsHistory")}
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
      {screen === "UserInfo" && <UserInfoScreen />}
      {screen === "AppointmentsHistory" && <AppointmentHistoryScreen />}
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
