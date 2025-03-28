import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111",
    },
    header: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
        padding: 16,
        backgroundColor: "#111",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    header_container: {
        width: "90%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    settingsIcon: {

    },
    headerText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    list: {
        paddingBottom: 80,
    },
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    placeholderAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#444",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarInitial: {
        color: "#ccc",
        fontSize: 18,
        fontWeight: "bold",
    },
    chatTextContainer: {
        flex: 1,
    },
    name: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    message: {
        color: "#999",
        fontSize: 14,
        marginTop: 2,
    },
    unreadBadge: {
        backgroundColor: "#8f84ff",
        borderRadius: 12,
        minWidth: 24,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    unreadText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        height: 70,
        flexDirection: "row",
        backgroundColor: "#111",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopColor: "#222",
        borderTopWidth: 1,
    },
    footerIcon: {
        fontSize: 22,
        color: "#fff",
    },
});

export default styles;
