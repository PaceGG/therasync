import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors } from "../constants/colors";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { ru } from "date-fns/locale";
import CustomButton from "../components/CustomButton";
import AddRecordScreen from "./AddRecordScreen";
import Task from "../components/Task";
import ClientTask from "../components/ClientTask";

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
  const [isRecordActive, setRecordActive] = useState<boolean>(false);
  const isClient = false;

  const handleAddRecord = () => {
    setRecordActive(true);
  };

  const confirmAddRecord = () => {
    setRecordActive(false);
  };

  return (
    <>
      {isRecordActive ? (
        <AddRecordScreen
          selectedDate={format(new Date(selected), "d MMMM yyyy", {
            locale: ru,
          })}
          confirmAddRecord={confirmAddRecord}
        />
      ) : (
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
                <MaterialIcons
                  name="arrow-left"
                  size={24}
                  color={Colors.icon}
                />
              ) : (
                <MaterialIcons
                  name="arrow-right"
                  size={24}
                  color={Colors.icon}
                />
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
            {isClient ? (
              <ScrollView style={{ marginTop: 12, maxHeight: 150 }}>
                <ClientTask title="завершенное чела" complete={true} />
                <ClientTask title="завершенное чела" complete={true} />
                <ClientTask title="завершенное чела" complete={true} />
                <ClientTask title="завершенное чела" complete={true} />
                <ClientTask title="завершенное чела" complete={true} />
                <ClientTask title="завершенное чела" complete={true} />
                <ClientTask title="завершенное чела" complete={true} />
              </ScrollView>
            ) : (
              <ScrollView style={{ marginTop: 12, maxHeight: 150 }}>
                <Task
                  title="Задание чела"
                  complete={true}
                  startTime={new Date()}
                  endTime={new Date()}
                />
              </ScrollView>
            )}

            {!isClient && (
              <CustomButton
                title="Добавить запись"
                backgroundColorProp={Colors.lightPrimary}
                onClick={handleAddRecord}
              />
            )}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightContainerBackground,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  info: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
  modal: {
    backgroundColor: Colors.containerBackground,
    gap: 22,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  date: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});
