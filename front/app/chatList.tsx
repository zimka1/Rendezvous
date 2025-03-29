import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import {
    SettingsIcon,
    ProfileIcon,
    HeartIcon,
    ChatIcon,
} from "./chatListIcons";
import styles from "./chatListStyles";
import { useWebSocket } from "./context/WebSocketContext";

interface ChatItem {
    id: number;
    name: string;
    last_message?: string;
}

export default function ChatListScreen() {
    const router = useRouter();
    const [users, setUsers] = useState<ChatItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { socket, sendJson } = useWebSocket();

    useEffect(() => {
        if (!socket) return;

        if (socket.readyState === WebSocket.OPEN) {
            sendJson({ command: "user_list_db" });
        } else {
            socket.onopen = () => {
                console.log("🔌 WebSocket connected (ChatListScreen)");
                sendJson({ command: "user_list_db" });
            };
        }

        const handleMessage = (event: MessageEvent) => {
            const raw = event.data?.trim();
            console.log("📨 WebSocket received:", raw);

            const looksLikeJson = raw.startsWith("{") || raw.startsWith("[");
            if (!looksLikeJson) {
                console.warn("⛔ Skipped non-JSON message:", raw);
                return;
            }

            try {
                const data = JSON.parse(raw);

                if (data.command === "user_list") {
                    setUsers(data.users);
                    setLoading(false);

                    // ➕ Запрашиваем последнее сообщение для каждого юзера
                    data.users.forEach((user: ChatItem) => {
                        sendJson({
                            command: "get_last_message",
                            user_id: user.id,
                        });
                    });
                }

                if (data.command === "last_message") {
                    setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === data.user_to || user.id === data.user_from
                                ? { ...user, last_message: data.message }
                                : user
                        )
                    );
                }

            } catch (err) {
                console.error("❌ JSON parse error:", err);
                console.log("📦 Problematic message:", raw);
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket]);

    const renderItem = ({ item }: { item: ChatItem }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
                router.push(`/chat/${item.id}?name=${encodeURIComponent(item.name)}`)
            }
        >
            <View style={styles.placeholderAvatar}>
                <Text style={styles.avatarInitial}>
                    {item.name.charAt(0).toUpperCase()}
                </Text>
            </View>
            <View style={styles.chatTextContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.message}>
                    {item.last_message || "No messages yet"}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.header_container}>
                        <Text style={styles.headerText}>Chat List</Text>
                        <Text style={styles.settingsIcon}>
                            <SettingsIcon size={30} color="#B3B3B3" />
                        </Text>
                    </View>
                </View>

                {/* Chat List */}
                {loading ? (
                    <ActivityIndicator size="large" color="#F77F00" />
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                    />
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity>
                        <Text style={styles.footerIcon}>
                            <ChatIcon size={40} color="#F77F00" />
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.footerIcon}>
                            <HeartIcon size={40} color="#B3B3B3" />
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.footerIcon}>
                            <ProfileIcon size={40} color="#B3B3B3" />
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}
