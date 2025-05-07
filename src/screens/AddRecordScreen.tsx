import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { Colors } from "../constants/colors";

type Props = {
  selectedDate: any;
  confirmAddRecord: any;
};

export default function AddRecordScreen({
  selectedDate,
  confirmAddRecord,
}: Props) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{selectedDate}</Text>

      <View style={styles.timeContainer}>
        <TextInput
          style={styles.inputTime}
          placeholder="начало"
          value={startTime}
          onChangeText={setStartTime}
        />
        <TextInput
          style={styles.inputTime}
          placeholder="конец"
          value={endTime}
          onChangeText={setEndTime}
        />
      </View>

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
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: Colors.containerBackground,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  scroll: {
    maxHeight: 150,
    marginBottom: 20,
  },
  clientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  selectedClient: {
    backgroundColor: "#D0E8FF",
  },
});
