import { View, Text } from "react-native";
import formatTime from "../utils/utilFunctions";

type Props = {
  name: string;
  startTime: Date;
  endTime: Date;
};

export default function Task({ name, startTime, endTime }: Props) {
  return (
    <View>
      <Text>{name}</Text>
      <Text>
        {formatTime(startTime)}-{formatTime(endTime)}
      </Text>
    </View>
  );
}
