import { Text, Image, View, TouchableOpacity } from "react-native";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { Colors } from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import UserOption from "../components/UserOption";

export default function ProfileScreen() {
  const [editing, setEditing] = useState(false);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("Ваше имя");

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
        <Image
          source={require("../assets/avatar.jpg")}
          style={styles.avatar}
        ></Image>
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
      <UserOption iconName="person" title="Личные данные" />
      <UserOption iconName="settings" title="Настройки" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FFF",
  },
  userHeader: {
    backgroundColor: Colors.containerBackground,
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 28,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 120,
  },
});
