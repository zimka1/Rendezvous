import React from "react";
import styles from "./chatListStyles";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { SettingsIcon, ProfileIcon, HeartIcon, ChatIcon } from "./chatListIcons";


export default function ChatListScreen() {
    interface ChatItem {
        id: string;
        name: string;
        lastMessage: string;
        avatar: string | null;
        unread: number;
    }


    const chats = [
        {
            id: "1",
            name: "Jim Carrey",
            lastMessage: "Jim: Hello!",
            avatar: "https://example.com/jim.jpg",
            unread: 1,
        },
        {
            id: "2",
            name: "Albert Eshnstein",
            lastMessage: "You: Hello!",
            avatar: "https://example.com/albert.jpg",
            unread: 0,
        },
        {
            id: "3",
            name: "Ivan Ivanov",
            lastMessage: "Ivan: Where are you?",
            avatar: null,
            unread: 3,
        },
        {
            id: "4",
            name: "Tom Hanks",
            lastMessage: "Tom: How are you?",
            avatar: null,
            unread: 2,
        },
    ];
    const renderItem = ({ item }: { item: ChatItem }) => (
        <TouchableOpacity style={styles.chatItem}>
            {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
                <View style={styles.placeholderAvatar}>
                    <Text style={styles.avatarInitial}>
                        {item.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
            )}
            <View style={styles.chatTextContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.message}>{item.lastMessage}</Text>
            </View>
            {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
            )}
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
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />

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

