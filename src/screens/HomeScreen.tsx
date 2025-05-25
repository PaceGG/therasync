import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ProgressBarAndroid,
  ImageBackground,
} from "react-native";
import * as Progress from "react-native-progress";
const HomeScreen = () => {
  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/background.png")}
    >
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Статьи</Text>
          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../assets/HomeScreen/icon1.jpg")}
              style={styles.fullImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Практики</Text>
          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../assets/HomeScreen/icon2.jpg")}
              style={styles.fullImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Задания</Text>
          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../assets/HomeScreen/icon3.jpg")}
              style={styles.fullImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Тесты</Text>
          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../assets/HomeScreen/icon4.jpg")}
              style={styles.fullImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.continueContainer}>
        <Text style={styles.continueText}>Продолжить...</Text>
        <Text style={styles.testTitle}>Тест: ваш тип личности</Text>
        <Text style={styles.progressText}>65%</Text>
        <View style={styles.progressRow}>
          <Progress.Bar
            progress={0.65}
            width={200}
            color="#8a82f8"
            unfilledColor="#ddd"
            borderWidth={0}
            height={10}
            borderRadius={5}
          />
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playText}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e6fa",
    padding: 20,
    paddingTop: 60,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    width: "48%",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  progressText: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  card: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  continueContainer: {
    marginTop: 30,
    backgroundColor: "#f5f5fc",
    padding: 16,
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  continueText: {
    color: "#888",
    fontSize: 12,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    marginLeft: 10,
    backgroundColor: "#8a82f8",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  playText: {
    color: "#fff",
    fontSize: 20,
  },
});

export default HomeScreen;
