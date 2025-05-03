import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    height: "100%",
  },
});
