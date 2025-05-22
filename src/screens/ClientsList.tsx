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
} from "react-native";
import ClientItem from "../components/ClientItem";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { getClientsByPsychologist } from "../services/client";
import { Client } from "../types";

export default function App() {
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      const clients = await getClientsByPsychologist();
      setClientsList(clients);
    };
    fetchClients();
  }, []);

  const handleMorePress = (name: string) => {
    setSelectedClient(name);
    setModalVisible(true);
  };

  const filteredClients = clientsList.filter((client) =>
    searchQuery.trim() === ""
      ? true
      : client.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Клиенты</Text>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Поиск..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredClients}
        keyExtractor={(item: Client) => item.id.toString()}
        renderItem={({ item }) => (
          <ClientItem
            name={item.firstName}
            onMorePress={() => handleMorePress(item.lastName)}
          />
        )}
      />
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalItem}>
              <Feather name="edit" size={20} color={Colors.icon} />
              <Text style={styles.modalText}>Заметки</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <Feather name="check-square" size={20} color={Colors.icon} />
              <Text style={styles.modalText}>Задания пользователя</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
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
    backgroundColor: "#ddd",
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
    width: 220,
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
