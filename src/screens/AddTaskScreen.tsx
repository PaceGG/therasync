import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Colors } from "../constants/colors";
import { getTasksByClient } from "../services/task";

type Task = {
  id: string;
  title: string;
  description: string;
  file?: string;
};

type Props = {
  goBack?: () => void;
};

export default function AddTasksScreen({ goBack }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = () => {
    if (!title.trim()) return Alert.alert("Ошибка", "Введите название задания");
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      file: "file.txt", // Заглушка
    };
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDescription("");
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <MaterialIcons name="arrow-back" size={24} color={Colors.icon} />
      </TouchableOpacity>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Все задания</Text>
      </View>

      <View style={styles.taskListContainer}>
        <ScrollView style={styles.scrollArea}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDesc} numberOfLines={1}>
                {task.description}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.addButtonText}>Добавить новое задание</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formLabel}>Задание №...</Text>
          <TextInput
            style={styles.input}
            placeholder="Название задания"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Описание задания"
            multiline
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => Alert.alert("Файл", "file.txt прикреплён")}
          >
            <Text style={styles.attachText}>📎 Файл</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
            <Text style={styles.saveText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef1ff",
    padding: 20,
    alignItems: "center",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    position: "absolute",
    top: -45,
    left: 25,
    zIndex: 300,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  taskListContainer: {
    borderWidth: 1,
    borderColor: "#9db4ff",
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  scrollArea: {
    padding: 10,
  },
  taskItem: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
  },
  taskTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  taskDesc: {
    fontSize: 14,
    color: "#555",
  },
  addButton: {
    backgroundColor: "#c7d7ff",
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  form: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#eef5ff",
    padding: 15,
    borderRadius: 10,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  attachButton: {
    backgroundColor: "#dde5ff",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  attachText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#d8f9c0",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e5d2e",
  },
});
