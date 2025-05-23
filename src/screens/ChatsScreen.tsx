import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import type { ChatRoom, Message } from "../types/chat";
import { getChatRooms, getMessages, sendMessage } from "../services/chat";

const USER_ID = 1; // Текущий пользователь (для мок-сервиса)

const ChatSelection = ({
  onSelectChat,
}: {
  onSelectChat: (chat: ChatRoom) => void;
}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [lastMessages, setLastMessages] = useState<{ [key: number]: string }>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      setLoading(true);
      const rooms = await getChatRooms(USER_ID);
      setChatRooms(rooms);

      const messagesPromises = rooms.map((room) => getMessages(room.id));
      const allMessages = await Promise.all(messagesPromises);

      const lastMsgs: { [key: number]: string } = {};
      rooms.forEach((room, idx) => {
        const msgs = allMessages[idx];
        if (msgs.length > 0) {
          lastMsgs[room.id] = msgs[msgs.length - 1].text;
        } else {
          lastMsgs[room.id] = "Нет сообщений";
        }
      });
      setLastMessages(lastMsgs);
      setLoading(false);
    }
    fetchChats();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="Поиск..." />
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => onSelectChat(item)}
          >
            <Text style={styles.chatName}>Чат #{item.id}</Text>
            <Text style={styles.lastMessage}>{lastMessages[item.id]}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const ChatView = ({ chat, onBack }: { chat: ChatRoom; onBack: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const msgs = await getMessages(chat.id);
      setMessages(msgs);
      setLoading(false);
    }
    fetchMessages();
  }, [chat]);

  const handleSend = async () => {
    if (inputText.trim() === "") return;
    setSending(true);
    try {
      const newMsg = await sendMessage(chat.id, USER_ID, inputText.trim());
      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
    } catch (e) {
      console.warn("Ошибка отправки сообщения", e);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={90}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>{"<"} Назад</Text>
        </TouchableOpacity>
        <Text style={styles.chatHeader}>Чат #{chat.id}</Text>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.senderId === USER_ID
                  ? styles.userMessage
                  : styles.otherMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Сообщение..."
            value={inputText}
            onChangeText={setInputText}
            editable={!sending}
          />
          <TouchableOpacity
            style={[styles.sendButton, sending && { opacity: 0.5 }]}
            onPress={handleSend}
            disabled={sending}
          >
            <MaterialIcons name="send" color={"white"} size={18} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default function ChatScreen() {
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);

  return selectedChat ? (
    <ChatView chat={selectedChat} onBack={() => setSelectedChat(null)} />
  ) : (
    <ChatSelection onSelectChat={setSelectedChat} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightContainerBackground,
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
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 10,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
    maxWidth: "80%",
  },
  otherMessage: {
    backgroundColor: "#d1d9ff",
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "white",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
  },
  messageInput: {
    flex: 1,
    padding: 12,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
});
