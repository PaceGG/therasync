import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors } from "../constants/colors";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";

LocaleConfig.locales["ru"] = {
  monthNames: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  monthNamesShort: [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ],
  dayNames: [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ],
  dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  today: "Сегодня",
};

LocaleConfig.defaultLocale = "ru";

export default function CalendarScreen() {
  const [selected, setSelected] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: "white",
            selectedTextColor: Colors.primary,
            customStyles: {
              container: {
                borderWidth: 1,
                borderColor: Colors.primary,
                borderRadius: 16,
              },
              text: {
                color: Colors.primary,
              },
            },
          },
          [today]: {
            customStyles: {
              container:
                selected == today
                  ? {
                      borderWidth: 1,
                      borderColor: Colors.primary,
                      borderRadius: 16,
                    }
                  : {},
              text: {
                color: Colors.primary,
              },
            },
          },
        }}
        renderArrow={(direction) =>
          direction === "left" ? (
            <MaterialIcons name="arrow-left" size={24} color={Colors.icon} />
          ) : (
            <MaterialIcons name="arrow-right" size={24} color={Colors.icon} />
          )
        }
        markingType="custom"
        onDayPress={(day) => {
          setSelected(day.dateString);
        }}
        firstDay={1}
        enableSwipeMonths={true}
      />
      {selected ? (
        <Text style={styles.info}>Вы выбрали: {selected}</Text>
      ) : (
        <Text style={styles.info}>Дата не выбрана</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  info: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
});
