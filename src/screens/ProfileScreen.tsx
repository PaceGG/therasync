import { Text, Image, View, TouchableOpacity, Alert } from "react-native";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { Colors } from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import UserOption from "../components/UserOption";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ navigation }: any) {
  const [avatarUri, setAvatarUri] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("Ваше имя");

  const isClient = true;

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ошибка", "Нужно разрешение на доступ к галерее");
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

  const handlePress = () => {
    setEditing(true);
    setInputText(username);
  };

  const handleConfirm = () => {
    if (inputText.trim()) {
      setUsername(inputText);
    }
    setEditing(false);
    setInputText("");
  };

  return (
    <ScrollView style={styles.mainContainer}>
      {/* user header */}
      <View style={styles.userHeader}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              avatarUri ? { uri: avatarUri } : require("../assets/noavatar.png")
            }
            style={styles.avatar}
          ></Image>
        </TouchableOpacity>
        {editing ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ваше имя"
            />
            <TouchableOpacity onPress={handleConfirm}>
              <MaterialIcons name="check" size={24} color={Colors.icon} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={{ display: "flex", flexDirection: "row" }}
            onPress={handlePress}
          >
            <MaterialIcons
              name="edit"
              size={24}
              color={Colors.icon}
              style={{ marginRight: 5 }}
            ></MaterialIcons>
            <Text style={{ fontSize: 20 }}>{username}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* user options */}
      <UserOption
        iconName="person"
        title="Личные данные"
        func={() => navigation.navigate("ClientsList")}
      />
      <UserOption
        iconName="settings"
        title="Настройки"
        func={() => navigation.navigate("ClientsList")}
      />
      {isClient && (
        <UserOption
          iconName={"people"}
          title="Список клиентов"
          func={() => navigation.navigate("ClientsList")}
        />
      )}
      {isClient && (
        <UserOption
          iconName={"history"}
          title="История консультаций и заданий"
          func={() => navigation.navigate("ClientsList")}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
