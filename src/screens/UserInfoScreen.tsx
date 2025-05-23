import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/colors";
import CustomButton from "../components/CustomButton";

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

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/background.png")}
    >
      <Text style={styles.label}>ID: {id}</Text>
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
  label: {
    fontSize: 16,
    marginTop: 12,
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
