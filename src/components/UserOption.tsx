import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

type Props = {
  iconName: any;
  title: string;
};

export default function UserOption({ iconName, title }: Props) {
  return (
    <View style={styles.main}>
      <MaterialIcons name={iconName} size={24} color={Colors.icon} />
      <Text style={{ fontSize: 20 }}>{title}</Text>
    </View>
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
