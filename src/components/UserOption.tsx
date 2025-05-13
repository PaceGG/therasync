import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

type Props = {
  iconName: any;
  title: string;
  func: () => any;
};

export default function UserOption({ iconName, title, func }: Props) {
  return (
    <TouchableOpacity style={styles.main} onPress={func}>
      <MaterialIcons name={iconName} size={24} color={Colors.icon} />
      <Text style={{ fontSize: 20 }}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    gap: 10,
    paddingLeft: 15,
    backgroundColor: Colors.containerBackground,
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 20,
  },
});
