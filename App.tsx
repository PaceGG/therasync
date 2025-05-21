import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./src/navigation";
import YandexAuthScreen from "./src/screens/AuthScreen";

export default function App() {
  return <YandexAuthScreen />;
}
