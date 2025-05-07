import { Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  backgroundColorProp: string;
};

export default function CustomButton({
  title,
  backgroundColorProp: backgroundColorProp,
}: Props) {
  return (
    <TouchableOpacity
      style={{ backgroundColor: backgroundColorProp, elevation: 3 }}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
