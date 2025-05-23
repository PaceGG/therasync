import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { Colors } from "../constants/colors";
import CustomButton from "../components/CustomButton";
import { MaterialIcons } from "@expo/vector-icons";

export default function UserInfoScreen() {
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    (async () => {
      const yandexJson = await AsyncStorage.getItem("YANDEX_PROFILE");
      const appFirstName = await AsyncStorage.getItem("appFirstName");
      const appLastName = await AsyncStorage.getItem("appLastName");

      if (yandexJson) {
        const profile = JSON.parse(yandexJson);
        setId(profile.id?.toString() || "—");

        if (appFirstName || appLastName) {
          setFirstName(appFirstName || "");
          setLastName(appLastName || "");
        } else if (profile.firstName || profile.lastName) {
          setFirstName(profile.firstName || "");
          setLastName(profile.lastName || "");
        } else if (profile.realName) {
          const [first = "", last = ""] = profile.realName.split(" ");
          setFirstName(first);
          setLastName(last);
        }
      }
    })();
  }, []);

  const saveChanges = async () => {
    try {
      await AsyncStorage.setItem("appFirstName", firstName);
      await AsyncStorage.setItem("appLastName", lastName);
      ToastAndroid.show("Данные сохранены", ToastAndroid.LONG);
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось сохранить данные");
    }
  };

  const copyIdToClipboard = async () => {
    await Clipboard.setStringAsync(id);
    ToastAndroid.show("ID скопирован", ToastAndroid.SHORT);
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/background.png")}
    >
      <View style={styles.idRow}>
        <Text style={styles.label}>ID: {id}</Text>
        <TouchableOpacity onPress={copyIdToClipboard} style={styles.copyButton}>
          <MaterialIcons name="content-copy" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Имя</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Фамилия</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <View style={styles.buttons}>
        <CustomButton
          title={"Сохранить"}
          backgroundColorProp={"white"}
          onClick={saveChanges}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  idRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  label: {
    fontSize: 16,
  },
  copyButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
});
