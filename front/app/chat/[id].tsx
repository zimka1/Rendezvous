import React, { useEffect, useRef, useState } from "react";
import {
    Keyboard,
    TouchableWithoutFeedback,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from "../chatStyles";
import { useUser } from "../context/UserContext";
import { useWebSocket } from "../context/WebSocketContext"; // ✅ Глобальный сокет

export default function ChatScreen() {
    const { userId } = useUser();
    const { socket, sendJson } = useWebSocket(); // ✅ Используем глобальный сокет

    const router = useRouter();
    const { id, name, avatar } = useLocalSearchParams<{
        id: string;
        name: string;
        avatar?: string;
    }>();

    const flatListRef = useRef<FlatList>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (!socket || !userId) return;

        const targetUserId = parseInt(id);

        const handleMessage = (event: MessageEvent) => {
            const raw = event.data?.trim();

            // Фильтрация
            if (!raw.startsWith("{") && !raw.startsWith("[")) return;

            try {
                const data = JSON.parse(raw);

                if (
                    data.command === "onlyReadMessages" ||
                    data.command === "onlyUnreadMessages"
                ) {
                    const adapted = data.messages.map((msg: any) => ({
                        id: `srv-${msg.id}`,
                        text: msg.message,
                        fromMe: msg.from === userId,
                    }));
                    setMessages((prev) => [...prev, ...adapted]);
                }

                // Входящие личные сообщения
                if (data.command === "private_msg") {
                    if (
                        data.user_from === parseInt(id) ||
                        data.user_to === parseInt(id)
                    ) {
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: `ws-${Date.now()}`,
                                text: data.message,
                                fromMe: data.user_from === userId,
                            },
                        ]);
                    }
                }
            } catch (err) {
                console.warn("⚠️ Invalid message:", raw);
            }
        };

        socket.addEventListener("message", handleMessage);

        // Запрашиваем сообщения
        if (socket.readyState === WebSocket.OPEN) {
            sendJson({
                command: "get_messages",
                user_id: parseInt(id),
                markMessagesAsRead: true,
            });
        } else {
            socket.onopen = () => {
                sendJson({
                    command: "get_messages",
                    user_id: parseInt(id),
                    markMessagesAsRead: true,
                });
            };
        }

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket, id, userId]);

    const handleSend = () => {
        if (!input.trim() || !socket || !userId) {return;}

        const message = {
            command: "private_msg",
            user_from: userId,
            user_to: parseInt(id),
            message: input,
        };

        sendJson(message);

        setMessages((prev) => [
            ...prev,
            {
                id: `local-${Date.now()}`,
                text: input,
                fromMe: true,
            },
        ]);
        setInput("");

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View
            style={[
                styles.messageBubble,
                item.fromMe ? styles.myMessage : styles.theirMessage,
            ]}
        >
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.push("../ChatList")}>
                                <Ionicons name="arrow-back" size={24} color="#FF5F7E" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>{name}</Text>
                            {avatar ? (
                                <Image source={{ uri: avatar }} style={styles.headerAvatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarInitial}>
                                        {name?.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Messages */}
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.messages}
                        />

                        {/* Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={input}
                                onChangeText={setInput}
                                placeholder="Enter your message..."
                                placeholderTextColor="#aaa"
                                style={styles.input}
                                onSubmitEditing={handleSend}
                                returnKeyType="send"
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                <Ionicons name="send" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
}
