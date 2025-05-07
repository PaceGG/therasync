import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/CustomButton";
import { Colors } from "../constants/colors";
import formatTime from "../utils/utilFunctions";

type Props = {
  selectedDate: any;
  confirmAddRecord: any;
};

export default function AddRecordScreen({
  selectedDate,
  confirmAddRecord,
}: Props) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null);
  const [search, setSearch] = useState("");

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS !== "ios") setShowPicker(null);
    if (!selectedTime) return;

    if (showPicker === "start") {
      setStartTime(selectedTime);
    } else if (showPicker === "end") {
      setEndTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{selectedDate}</Text>

      <View style={styles.timeContainer}>
        <TouchableOpacity
          style={styles.inputTime}
          onPress={() => setShowPicker("start")}
        >
          <Text>{formatTime(startTime)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputTime}
          onPress={() => setShowPicker("end")}
        >
          <Text>{formatTime(endTime)}</Text>
        </TouchableOpacity>
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
        placeholder="Введите имя клиента"
        value={search}
        onChangeText={setSearch}
      />

      <CustomButton
        title="Сохранить"
        backgroundColorProp={"#C8FACC"}
        onClick={confirmAddRecord}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  date: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inputTime: {
    flex: 1,
    backgroundColor: Colors.lightPrimary,
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  searchInput: {
    backgroundColor: Colors.containerBackground,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
});
