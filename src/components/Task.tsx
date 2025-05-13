import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import formatTime from "../utils/utilFunctions";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "../constants/colors";
import { useState } from "react";

type Props = {
  title: string;
  startTime: Date;
  endTime: Date;
  complete: boolean;
};

export default function Task({ title, startTime, endTime, complete }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
      }}
    >
      {/* Основной контент задачи */}
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 6,
          }}
        >
          <Ionicons
            name="checkmark"
            size={18}
            color="#4e4e4e"
            style={[
              styles.checkmark,
              { backgroundColor: complete ? "#b8c0fe" : "#c2c2c2" },
            ]}
          />
          <Text style={{ fontSize: 15 }}>{title}</Text>
        </View>
        <Text style={{ marginLeft: 40, marginTop: -10 }}>
          {formatTime(startTime)} - {formatTime(endTime)}
        </Text>
      </View>

      {/* Кнопка для показа модалки */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Entypo name="dots-three-horizontal" color={Colors.icon} size={18} />
      </TouchableOpacity>

      {/* Модальное окно */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() => setModalVisible(false)}
            >
              <Entypo name="cross" size={24} color={Colors.icon} />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <MaterialIcons
                name="edit"
                size={24}
                color={Colors.icon}
                style={{ marginRight: 10 }}
              />
              <Text>Редактировать запись</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="delete"
                size={24}
                color={"#F85A5D"}
                style={{ marginRight: 10 }}
              />
              <Text>Удалить запись</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  checkmark: {
    borderRadius: 30,
    padding: 6,
    marginRight: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 250,
    backgroundColor: "#D0D8FF",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
});
