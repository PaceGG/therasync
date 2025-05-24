import React, { useEffect, useState } from "react";
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
import { getActiveTasks, respondToTask } from "../services/task"; // Импорт твоих мок сервисов
import { Task } from "../types/task";

type TasksScreenProps = {
  navigation: any;
  clientId?: number; // если надо, чтобы фильтровать задачи по клиенту
};

export default function TasksScreen({ navigation, clientId }: TasksScreenProps) {
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getActiveTasks();
        // Если нужно фильтровать задачи по clientId
        const filteredTasks = clientId
          ? tasks.filter((t) => t.clientId === clientId)
          : tasks;
        setCurrentTasks(filteredTasks);
        setCompletedTasks([]); // или загрузить completedTasks из другой функции
      } catch (e) {
        console.error("Ошибка загрузки задач:", e);
      }
    };
    fetchTasks();
  }, [clientId]);

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setResponseText("");
    setAttachedFile(null);
    setModalVisible(true);
  };

  const handleSaveResponse = async () => {
    if (!selectedTask) return;

    try {
      const updatedTask = await respondToTask(
        selectedTask.id,
        responseText,
        attachedFile ?? undefined
      );
      setCurrentTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
      setCompletedTasks((prev) => [...prev, updatedTask]);
      setModalVisible(false);
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось сохранить ответ");
      console.error(e);
    }
  };

  const attachFile = () => {
    setAttachedFile("file.txt");
    Alert.alert("Файл прикреплён", "file.txt");
  };

  const renderTaskCard = (task: Task, isCompleted: boolean = false) => (
    <TouchableOpacity
      key={task.id.toString()}
      onPress={() => !isCompleted && openTaskModal(task)}
      style={[styles.taskCard, isCompleted && styles.completedCard]}
    >
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDescription}>{task.taskText}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/noavatar.png")}
          style={styles.avatar}
        />
        <Text style={styles.headerText}>Задания</Text>
      </View>

      <Text style={styles.sectionTitle}>Текущие задания</Text>
      <FlatList
        data={currentTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderTaskCard(item)}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
            Нет текущих заданий
          </Text>
        }
      />

      <Text style={styles.sectionTitle}>Завершенные задания</Text>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderTaskCard(item, true)}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
            Нет завершённых заданий
          </Text>
        }
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
              {selectedTask?.taskText}
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
});
