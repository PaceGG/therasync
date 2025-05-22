import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ImageBackground,
  ToastAndroid,
  BackHandler,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/CustomButton";
import { Colors } from "../constants/colors";
import formatTime from "../utils/utilFunctions";
import {
  createAppointment,
  getPsychologistAppointments,
} from "../services/appointment";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";
import { getClientsByPsychologist } from "../services/client";
import { Client } from "../types";

type Props = {
  selectedDate: string;
  confirmAddRecord: () => void;
  cancelAddRecord: () => void;
};

export default function AddRecordScreen({
  selectedDate,
  confirmAddRecord,
  cancelAddRecord,
}: Props) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      const result = await getClientsByPsychologist();
      setClients(result);
      setFilteredClients(result);
    };
    loadClients();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        cancelAddRecord();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredClients(
      clients.filter((client) => client.firstName.toLowerCase().includes(q))
    );
  }, [search, clients]);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS !== "ios") setShowPicker(null);
    if (!selectedTime) return;
    if (showPicker === "start") setStartTime(selectedTime);
    else if (showPicker === "end") setEndTime(selectedTime);
  };

  const checkOverlap = (
    newStart: Date,
    newEnd: Date,
    existingStart: string,
    existingEnd: string
  ) => {
    const exStart = new Date(`${selectedDate}T${existingStart}:00`);
    const exEnd = new Date(`${selectedDate}T${existingEnd}:00`);
    return newStart < exEnd && newEnd > exStart;
  };

  const handleSaveRecord = async () => {
    if (!startTime || !endTime || !selectedClientId) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
      return;
    }

    const newStart = new Date(
      `${selectedDate}T${startTime.toTimeString().substring(0, 5)}:00`
    );
    const newEnd = new Date(
      `${selectedDate}T${endTime.toTimeString().substring(0, 5)}:00`
    );

    if (newEnd <= newStart) {
      Alert.alert("Ошибка", "Время окончания должно быть позже начала");
      return;
    }

    try {
      const allAppointments = await getPsychologistAppointments();
      const todays = allAppointments.filter((app) => app.date === selectedDate);
      const conflict = todays.find((app) =>
        checkOverlap(newStart, newEnd, app.startTime, app.endTime)
      );

      if (conflict) {
        Alert.alert(
          "Ошибка",
          `Запись пересекается: с ${conflict.startTime} до ${conflict.endTime}`
        );
        return;
      }

      await createAppointment({
        date: selectedDate,
        startTime: newStart.toTimeString().substring(0, 5),
        endTime: newEnd.toTimeString().substring(0, 5),
        clientId: selectedClientId,
      });

      ToastAndroid.show("Запись добавлена", ToastAndroid.SHORT);
      confirmAddRecord();
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить запись");
      console.error(error);
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/background.png")}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.backButton} onPress={cancelAddRecord}>
        <MaterialIcons name="arrow-back" size={24} color={Colors.icon} />
      </TouchableOpacity>

      <Text style={styles.date}>
        {format(new Date(selectedDate), "dd MMMM yyyy")}
      </Text>

      <View style={styles.timeContainer}>
        <View style={{ width: "50%" }}>
          <Text style={styles.timeLabel}>Начало</Text>
          <TouchableOpacity
            style={styles.inputTime}
            onPress={() => setShowPicker("start")}
          >
            <Text>{formatTime(startTime)}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "50%" }}>
          <Text style={styles.timeLabel}>Конец</Text>
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
        placeholder="Поиск клиента по имени"
        value={search}
        onChangeText={setSearch}
      />

      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={true}
          data={filteredClients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.clientItem,
                item.id === selectedClientId && styles.clientItemSelected,
              ]}
              onPress={() => setSelectedClientId(item.id)}
            >
              <Text style={styles.clientText}>{item.firstName}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <CustomButton
        title="Сохранить"
        backgroundColorProp="white"
        onClick={handleSaveRecord}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: -55,
    left: 25,
    zIndex: 300,
  },
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
  timeLabel: {
    textAlign: "center",
    fontSize: 20,
  },
  inputTime: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  clientItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  clientItemSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  clientText: {
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
});
