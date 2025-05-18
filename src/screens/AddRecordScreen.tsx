import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/CustomButton";
import { Colors } from "../constants/colors";
import formatTime from "../utils/utilFunctions";
import { createAppointment } from "../services/appointments";

type Props = {
  selectedDate: string; // формат: '2025-05-18'
  confirmAddRecord: () => void;
};

export default function AddRecordScreen({
  selectedDate,
  confirmAddRecord,
}: Props) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null);
  const [consultationName, setConsultationName] = useState("");
  const [search, setSearch] = useState(""); // клиент

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS !== "ios") setShowPicker(null);
    if (!selectedTime) return;
    if (showPicker === "start") {
      setStartTime(selectedTime);
    } else if (showPicker === "end") {
      setEndTime(selectedTime);
    }
  };

  const handleSaveRecord = async () => {
    if (!startTime || !endTime || !search.trim()) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
      return;
    }

    try {
      const appointment = {
        date: selectedDate,
        startTime: startTime.toTimeString().substring(0, 5), // 'HH:mm'
        endTime: endTime.toTimeString().substring(0, 5), // 'HH:mm'
        psychologistId: "1", // TODO: заменить на текущего пользователя
        clientId: search.trim(), // пока используем как ID или имя, зависит от API
      };

      await createAppointment(appointment);
      Alert.alert("Успех", "Запись добавлена");
      confirmAddRecord(); // переход назад или обновление экрана
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить запись");
      console.error("Ошибка при создании записи:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{selectedDate}</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Название консультации"
        value={consultationName}
        onChangeText={setConsultationName}
      />

      <View style={styles.timeContainer}>
        <View style={{ width: "50%" }}>
          <Text style={{ textAlign: "center", fontSize: 20 }}>Начало</Text>
          <TouchableOpacity
            style={styles.inputTime}
            onPress={() => setShowPicker("start")}
          >
            <Text>{formatTime(startTime)}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: "50%" }}>
          <Text style={{ textAlign: "center", fontSize: 20 }}>Конец</Text>
          <TouchableOpacity
            style={styles.inputTime}
            onPress={() => setShowPicker("end")}
          >
            <Text>{formatTime(endTime)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Введите ID клиента"
        value={search}
        onChangeText={setSearch}
      />

      <CustomButton
        title="Сохранить"
        backgroundColorProp={Colors.lightPrimary}
        onClick={handleSaveRecord}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  date: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
  },
  inputTime: {
    flex: 1,
    backgroundColor: Colors.containerBackground,
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  searchInput: {
    backgroundColor: Colors.containerBackground,
    borderRadius: 10,
    padding: 10,
  },
});
