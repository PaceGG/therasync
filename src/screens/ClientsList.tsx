import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ToastAndroid,
} from "react-native";
import ClientItem from "../components/ClientItem";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { getUserById } from "../services/auth";
import {
  getClientsByPsychologist,
  addClient,
  deleteClient,
} from "../services/client";
import { Client } from "../types";

export default function App() {
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newClientId, setNewClientId] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      const clients = await getClientsByPsychologist();
      setClientsList(clients);
    };
    fetchClients();
  }, []);

  const handleAddClient = async () => {
    try {
      const user = await getUserById(Number(newClientId));
      if (!user) throw new Error("USER_NOT_FOUND");
      const client: Client = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      await addClient(client);
      // setClientsList((prev) => [...prev, client]);
      setAddModalVisible(false);
      setNewClientId("");
    } catch (e) {
      if (e instanceof Error && e.message === "USER_NOT_FOUND")
        ToastAndroid.show("Клиент не найден", ToastAndroid.SHORT);
      if (e instanceof Error && e.message === "CLIENT_IS_EXISTS")
        ToastAndroid.show("Клиент уже добавлен", ToastAndroid.SHORT);
    }
  };

  const handleMorePress = (id: number) => {
    setSelectedClientId(id);
    setModalVisible(true);
  };

  const handleDeletePress = () => {
    setConfirmDeleteVisible(true);
    setModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedClientId === null) return;

    try {
      await deleteClient(selectedClientId);
      setClientsList((prev) => prev.filter((c) => c.id !== selectedClientId));
    } catch (e) {
      console.error("Ошибка при удалении клиента:", e);
    } finally {
      setConfirmDeleteVisible(false);
      setSelectedClientId(null);
      ToastAndroid.show(`Клиент успешно удален`, ToastAndroid.LONG);
    }
  };

  const filteredClients = clientsList.filter((client) =>
    searchQuery.trim() === ""
      ? true
      : client.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Клиенты</Text>

      {/* Список клиентов */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Поиск..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredClients}
        keyExtractor={(item: Client) => item.id.toString()}
        renderItem={({ item }) => (
          <ClientItem
            name={`${item.firstName} ${item.lastName}`}
            onMorePress={() => handleMorePress(item.id)}
          />
        )}
      />

      {/* Модалка добавления клиента */}
      <Modal visible={addModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { paddingVertical: 24, minHeight: 180 },
            ]}
          >
            <Text
              style={[styles.modalText, { fontSize: 18, marginBottom: 16 }]}
            >
              Введите ID клиента
            </Text>
            <TextInput
              style={[styles.searchInput, { marginBottom: 20 }]}
              placeholder="ID клиента"
              value={newClientId}
              onChangeText={setNewClientId}
              keyboardType="numeric"
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Text style={styles.modalText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddClient}>
                <Text style={[styles.modalText, { color: Colors.icon }]}>
                  Добавить
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модалка клиента */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* <TouchableOpacity style={styles.modalItem}>
              <Feather name="edit" size={20} color={Colors.icon} />
              <Text style={styles.modalText}>Заметки</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.modalItem}>
              <Feather name="check-square" size={20} color={Colors.icon} />
              <Text style={styles.modalText}>Задания пользователя</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={handleDeletePress}
            >
              <MaterialIcons name="delete" size={20} color="red" />
              <Text style={[styles.modalText, { color: "red" }]}>
                Удалить клиента
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={20} color={Colors.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модалка подтверждения удаления клиента */}
      <Modal visible={confirmDeleteVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, { marginBottom: 12 }]}>
              Удалить клиента?
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity onPress={() => setConfirmDeleteVisible(false)}>
                <Text style={[styles.modalText, { color: Colors.icon }]}>
                  Отмена
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text style={[styles.modalText, { color: "red" }]}>
                  Удалить
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f0ff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    paddingLeft: 16,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalContent: {
    backgroundColor: "#dce7ff",
    borderRadius: 12,
    padding: 16,
    width: 250,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  modalText: {
    fontSize: 16,
    color: "#222",
  },
  modalClose: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
