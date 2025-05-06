import { Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

export default function Header() {
  const [fontsLoaded] = useFonts({
    "Rounded Mplus 1c": require("../../assets/fonts/MPLUSRounded1c-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Therasync</Text>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  logo: {
    width: 35,
    height: 35,
    marginLeft: 10,
  },
  title: {
    fontFamily: "Rounded Mplus 1c",
    fontSize: 20,
  },
});
