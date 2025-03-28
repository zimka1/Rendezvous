import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        paddingTop: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#1a1a1a",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center",
        flex: 1,
        marginHorizontal: 10,
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#444",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarInitial: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    messages: {
        padding: 12,
        paddingBottom: 100,
    },
    messageBubble: {
        maxWidth: "70%",
        padding: 10,
        marginVertical: 6,
        borderRadius: 14,
    },
    myMessage: {
        backgroundColor: "#FF5F7E",
        alignSelf: "flex-end",
    },
    theirMessage: {
        backgroundColor: "#F77F00",
        alignSelf: "flex-start",
    },
    messageText: {
        color: "#fff",
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        borderTopWidth: 1,
        borderTopColor: "#333",
        paddingBottom: 30,
        width: "100%",
        height: 80,
    },
    input: {
        width: "75%",
        backgroundColor: "#2a2a2a",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        color: "#fff",
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: "#FF5F7E",
        borderRadius: 50,
        padding: 5,
    },
});


export default styles;
