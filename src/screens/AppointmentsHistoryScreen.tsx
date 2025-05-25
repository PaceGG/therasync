import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { getPsychologistAppointments } from "../services/appointment";
import { getUserById } from "../services/auth";
import { Appointment } from "../types";

type AppointmentWithClient = Appointment & {
  clientName: string;
};

const backgroundImage = require("../assets/background.png");

const AppointmentHistoryScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const rawAppointments = await getPsychologistAppointments();

        const pastAppointments = rawAppointments.filter(
          (appt: Appointment) =>
            new Date(`${appt.date}T${appt.endTime}`) < new Date()
        );

        const enrichedAppointments = await Promise.all(
          pastAppointments.map(async (appt: Appointment) => {
            try {
              const user = await getUserById(appt.clientId);
              return {
                ...appt,
                clientName: `${user.lastName} ${user.firstName}`,
              };
            } catch {
              return {
                ...appt,
                clientName: `Клиент #${appt.clientId}`,
              };
            }
          })
        );

        setAppointments(
          enrichedAppointments.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      } catch (error) {
        console.error("Ошибка загрузки встреч:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const content = () => {
    if (loading) {
      return <ActivityIndicator style={styles.loader} size="large" />;
    }

    if (appointments.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Нет завершённых консультаций</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            <Text style={styles.time}>
              {item.startTime} – {item.endTime}
            </Text>
            <Text style={styles.client}>{item.clientName}</Text>
          </View>
        )}
      />
    );
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>{content()}</View>
    </ImageBackground>
  );
};

const formatDate = (dateStr: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return new Date(dateStr).toLocaleDateString("ru-RU", options);
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#444",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
  },
  client: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },
});

export default AppointmentHistoryScreen;
