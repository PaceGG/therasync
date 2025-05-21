import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "../constants/colors";
import { View } from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import Header from "../components/Header";
import HomeScreen from "../screens/HomeScreen";
import TasksScreen from "../screens/TasksScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ChatsScreen from "../screens/ChatsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TabBar from "../components/TabBar";
import ClientsList from "../screens/ClientsList";

const Tab = createBottomTabNavigator();

type Props = {
  logout: () => void;
};

export default function Navigation({ logout }: Props) {
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
          children={() => <ProfileScreen logout={logout} />}
          options={{ header: () => <Header /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
