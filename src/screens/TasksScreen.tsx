import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AddTaskScreen from "./AddTaskScreen"; // Укажи путь, если другой

type Task = {
  id: string;
  title: string;
  description: string;
  response?: string;
  file?: string;
};

const initialCurrentTasks: Task[] = [
  {
    id: "1",
    title: "Арт-терапия",
    description: "Нарисуйте дом, дерево, человека...",
  },
  {
    id: "2",
    title: "Ведение дневника",
    description: "Запишите текущее состояние",
  },
];

export default function TasksScreen({ navigation }: any) {
  const [currentTasks, setCurrentTasks] = useState<Task[]>(initialCurrentTasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [screen, setScreen] = useState<string>("Tasks");

  const isModerator = true;

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setResponseText("");
    setAttachedFile(null);
    setModalVisible(true);
  };

  const handleSaveResponse = () => {
    if (!selectedTask) return;

    const updatedTask: Task = {
      ...selectedTask,
      response: responseText,
      file: attachedFile ?? undefined,
    };

    setCurrentTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
    setCompletedTasks((prev) => [...prev, updatedTask]);
    setModalVisible(false);
  };

  const attachFile = () => {
    setAttachedFile("file.txt");
    Alert.alert("Файл прикреплён", "file.txt");
  };

  const renderTaskCard = (task: Task, isCompleted: boolean = false) => (
    <TouchableOpacity
      onPress={() => !isCompleted && openTaskModal(task)}
      style={[styles.taskCard, isCompleted && styles.completedCard]}
    >
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDescription}>{task.description}</Text>
    </TouchableOpacity>
  );

  if (screen === "AddTask") {
    return <AddTaskScreen goBack={() => setScreen("Tasks")} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/noavatar.png")}
          style={styles.avatar}
        />
        <View style={styles.headerWithButton}>
          <Text style={styles.headerText}>Задания Валеры</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Текущие задания</Text>
      <FlatList
        data={currentTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTaskCard(item)}
      />

      <Text style={styles.sectionTitle}>Завершенные задания</Text>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTaskCard(item, true)}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedTask?.title}</Text>
            <Text style={styles.modalDescription}>
              {selectedTask?.description}
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Ваш ответ..."
              multiline
              value={responseText}
              onChangeText={setResponseText}
            />

            <TouchableOpacity style={styles.fileButton} onPress={attachFile}>
              <Text style={styles.fileIcon}>📎</Text>
              <Text style={styles.fileButtonText}>Прикрепить файл</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveResponse}
            >
              <Text style={styles.saveButtonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isModerator && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setScreen("AddTask")}
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7E9FF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 6,
    color: "#5A5A5A",
  },
  taskCard: {
    backgroundColor: "#C7CFFE",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  completedCard: {
    backgroundColor: "#E5E3F3",
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  taskDescription: {
    fontSize: 13,
    color: "#4D4D4D",
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "85%",
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalDescription: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    minHeight: 60,
    marginBottom: 10,
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  fileIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  fileButtonText: {
    fontSize: 16,
    color: "#007bff",
  },
  saveButton: {
    backgroundColor: "#d6f4bb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  saveButtonText: {
    color: "#004d40",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#888",
  },
  headerWithButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#5568FE",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    lineHeight: 36,
  },
});
