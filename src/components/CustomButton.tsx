import { Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  backgroundColorProp: string;
  onClick: () => void;
};

export default function CustomButton({
  title,
  backgroundColorProp: backgroundColorProp,
  onClick,
}: Props) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: backgroundColorProp,
        elevation: 3,
        borderRadius: 10,
      }}
      onPress={onClick}
    >
      <Text style={{ fontSize: 20, textAlign: "center", padding: 8 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
