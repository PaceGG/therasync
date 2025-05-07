import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors } from "../constants/colors";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";
import { ru } from "date-fns/locale";

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
  const today = format(new Date(), "yyyy-MM-dd");
  const [selected, setSelected] = useState(today);

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

      <View style={styles.modal}>
        <View style={styles.date}>
          {selected === today ? (
            <Text style={{ fontSize: 20, marginRight: 14 }}>Сегодня</Text>
          ) : (
            <></>
          )}
          <Text style={{ fontSize: 15 }}>
            {format(new Date(selected), "d MMMM", { locale: ru })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "space-between",
  },
  info: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
  modal: {
    backgroundColor: Colors.containerBackground,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  date: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});
