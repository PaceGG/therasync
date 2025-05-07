import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

import { Colors } from "../constants/colors";

const { width } = Dimensions.get("window");
const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;
const BUBBLE_SIZE = 63;

const icons = ["home", "task", "calendar-month", "chat", "person"];

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const translateX = useSharedValue(
    state.index * TAB_WIDTH + (TAB_WIDTH - BUBBLE_SIZE) / 2
  );
  const currentIndex = useSharedValue(state.index);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const onPress = (index: number, routeName: string, isFocused: boolean) => {
    translateX.value = withTiming(
      index * TAB_WIDTH + (TAB_WIDTH - BUBBLE_SIZE) / 2,
      { duration: 300 }
    );
    currentIndex.value = withTiming(index, { duration: 300 });

    if (!isFocused) {
      navigation.navigate(routeName);
    }
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor:
        currentIndex.value === 2 ? Colors.containerBackground : "white",
    };
  });

  return (
    <Animated.View style={containerStyle}>
      <View style={styles.tabBar}>
        <Animated.View style={[styles.bubble, bubbleStyle]} />

        {state.routes.map((route, index) => {
          const focused = state.index === index;

          const animatedIconStyle = useAnimatedStyle(() => {
            const color = interpolateColor(
              currentIndex.value,
              [index - 1, index, index + 1],
              [Colors.icon, "white", Colors.icon]
            );
            return { color };
          });

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onPress(index, route.name, focused)}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              <AnimatedIcon
                name={icons[index] as any}
                size={26}
                style={animatedIconStyle}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 70,
    backgroundColor: Colors.lightContainerBackground,
    position: "relative",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    position: "absolute",
    top: -15,
    width: BUBBLE_SIZE,
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: Colors.primary,
    zIndex: 0,
  },
});

export default CustomTabBar;
