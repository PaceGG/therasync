import { Text, Image, View, TouchableOpacity, Alert } from "react-native";
import { ScrollView, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import UserOption from "../components/UserOption";
import * as ImagePicker from "expo-image-picker";
import ClientTask from "../components/ClientTask";
import ClientsList from "./ClientsList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "../api";

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
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ошибка", "Нужно разрешение на доступ к галерее");
      }

      // Загружаем профиль из AsyncStorage
      const json = await AsyncStorage.getItem("YANDEX_PROFILE");
      if (json) {
        try {
          const profile = JSON.parse(json);
          setRealName(profile.realName || "Имя не найдено");
          if (profile.avatarUrl) setAvatarUri(profile.avatarUrl);
        } catch (e) {
          console.warn("Ошибка чтения профиля:", e);
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

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
        <ScrollView style={styles.mainContainer}>
          {/* user header */}
          <View style={styles.userHeader}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  avatarUri
                    ? { uri: avatarUri }
                    : require("../assets/noavatar.png")
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="person"
                size={24}
                color={Colors.icon}
                style={{ marginRight: 5 }}
              />
              <Text style={{ fontSize: 20 }}>{realName}</Text>
            </View>
          </View>

          {/* user options */}
          <UserOption iconName="person" title="Личные данные" func={() => {}} />
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
      )}
      {screen === "ClientsList" && <ClientsList />}
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: -55,
    left: 25,
    zIndex: 300,
  },
  mainContainer: {
    backgroundColor: Colors.lightContainerBackground,
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
