import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";

type Props = {
  title: string;
  complete: boolean;
};

export default function ClientTask({ title, complete }: Props) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}
    >
      {complete ? (
        <Ionicons
          name="checkmark"
          size={18}
          color="#4e4e4e"
          style={[styles.checkmark, { backgroundColor: "#b8c0fe" }]}
        />
      ) : (
        <Ionicons
          name="checkmark"
          size={18}
          color="#4e4e4e"
          style={[styles.checkmark, { backgroundColor: "#c2c2c2" }]}
        />
      )}
      <Text style={{ fontSize: 15 }}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkmark: {
    borderRadius: 30,
    padding: 6,
    marginRight: 10,
  },
});
