import { View, Text } from "react-native-reanimated/lib/typescript/Animated";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  iconName: any;
  title: string;
};

export default function userOption({ iconName, title }: Props) {
  return (
    <View>
      <MaterialIcons name={iconName} />
      <Text>{title}</Text>
    </View>
  );
}
