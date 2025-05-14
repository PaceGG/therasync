import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const chatList = [
  { id: "1", name: "Психолог раз", lastMessage: "Здравствуйте!" },
  { id: "2", name: "Психолог два", lastMessage: "Как Ваше состояние?" },
  { id: "3", name: "Психолог три", lastMessage: "Начнём нашу первую сессию?" },
  {
    id: "4",
    name: "Чат поддержки",
    lastMessage: "Готовы помочь в любое время дня и ночи",
  },
];

const messages = [
  {
    id: "1",
    fromUser: false,
    text: "Всё суета сует и возня...\nЯ виновен в смерти Христа и виноват за этот ад…",
  },
  { id: "2", fromUser: false, text: "Что по заданию, бро?" },
  { id: "3", fromUser: false, text: "📎 Файл" },
  { id: "4", fromUser: true, text: "👍" },
];

const ChatSelection = ({ onSelectChat }: any) => (
  <View style={styles.container}>
    <TextInput style={styles.searchInput} placeholder="Поиск..." />
    <FlatList
      data={chatList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => onSelectChat(item)}
        >
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

const ChatView = ({ chat, onBack }: any) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Text style={styles.backText}>{"<"} Назад</Text>
    </TouchableOpacity>
    <Text style={styles.chatHeader}>{chat.name}</Text>
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View
          style={[
            styles.messageBubble,
            item.fromUser ? styles.userMessage : styles.otherMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      )}
    />
    <TextInput style={styles.messageInput} placeholder="Сообщение..." />
  </View>
);

export default function ChatsScreen() {
  const [selectedChat, setSelectedChat] = useState(null);

  return selectedChat ? (
    <ChatView chat={selectedChat} onBack={() => setSelectedChat(null)} />
  ) : (
    <ChatSelection onSelectChat={setSelectedChat} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef1ff",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 12,
    borderRadius: 12,
  },
  chatItem: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  backButton: {
    padding: 16,
  },
  backText: {
    color: "#333",
    fontSize: 16,
  },
  chatHeader: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    // maxWidth: "80",
  },
  otherMessage: {
    backgroundColor: "#d1d9ff",
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#b0f1b5",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 16,
  },
  messageInput: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 12,
    borderRadius: 12,
  },
});
