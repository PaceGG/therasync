import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { Colors } from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { getChatRooms, getMessages, sendMessage } from "../services/chat";
import { ChatRoom, Message, User } from "../types";
import { getUserById, getUserId } from "../services/auth";

const ChatSelection = ({ onSelectChat }: any) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [interlocutors, setInterlocutors] = useState<Record<number, User>>({});
  const [lastMessages, setLastMessages] = useState<
    Record<number, Message | undefined>
  >({});
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    async function loadChats() {
      const userId = await getUserId();
      setCurrentUserId(userId);
      const rooms = await getChatRooms(userId);
      setChatRooms(rooms);

      const usersMap: Record<number, User> = {};
      const messagesMap: Record<number, Message | undefined> = {};

      await Promise.all(
        rooms.map(async (room) => {
          const interlocutorId =
            room.participant1Id === userId
              ? room.participant2Id
              : room.participant1Id;
          const user = await getUserById(interlocutorId);
          usersMap[room.id] = user;
          const messages = await getMessages(room.id);
          messagesMap[room.id] = messages[messages.length - 1];
        })
      );

      setInterlocutors(usersMap);
      setLastMessages(messagesMap);
    }

    loadChats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="Поиск..." />
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => {
          const user = interlocutors[item.id];
          const message = lastMessages[item.id];
          return (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => onSelectChat({ room: item, user })}
            >
              <Text style={styles.chatName}>
                {user ? `${user.lastName} ${user.firstName}` : "..."}
              </Text>
              <Text style={styles.lastMessage}>{message?.text ?? ""}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

// ChatView
const ChatView = ({
  chat,
  interlocutor,
  onBack,
}: {
  chat: ChatRoom;
  interlocutor: User;
  onBack: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    async function loadMessages() {
      const userId = await getUserId();
      setCurrentUserId(userId);
      const data = await getMessages(chat.id);
      setMessages(data);
    }
    loadMessages();
  }, [chat]);

  const handleSend = async () => {
    if (inputText.trim() === "" || currentUserId === null) return;
    const newMsg = await sendMessage(chat.id, currentUserId, inputText.trim());
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      keyboardVerticalOffset={80}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>{"<"} Назад</Text>
        </TouchableOpacity>
        <Text style={styles.chatHeader}>
          {`${interlocutor.lastName} ${interlocutor.firstName}`}
        </Text>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.senderId === currentUserId
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
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <MaterialIcons name="send" color={"white"} size={18} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default function ChatScreen() {
  const [selectedChat, setSelectedChat] = useState<{
    room: ChatRoom;
    user: User;
  } | null>(null);

  return selectedChat ? (
    <ChatView
      chat={selectedChat.room}
      interlocutor={selectedChat.user}
      onBack={() => setSelectedChat(null)}
    />
  ) : (
    <ChatSelection onSelectChat={setSelectedChat} />
  );
}

// Styles
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
