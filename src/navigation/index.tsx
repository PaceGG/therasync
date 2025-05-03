import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "../constants/colors";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import Header from "../compnents/Header";
import HomeScreen from "../screens/HomeScreen";
import TasksScreen from "../screens/TasksScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ChatsScreen from "../screens/ChatsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TabBar from "../compnents/TabBar";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ header: () => <Header /> }}
        />
        <Tab.Screen
          name="Tasks"
          component={TasksScreen}
          options={{ header: () => <Header /> }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ header: () => <Header /> }}
        />
        <Tab.Screen
          name="Chats"
          component={ChatsScreen}
          options={{ header: () => <Header /> }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ header: () => <Header /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
