
import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "white",
        marginBottom: 40,
    },
    input: {
        backgroundColor: "#333",
        color: "white",
        width: "85%",
        fontSize: 18,
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
    },
    googleButton: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 15,
        width: "85%",
        paddingVertical: 15,
        alignItems: "center",
        marginBottom: 20,
    },
    googleText: {
        marginLeft: "10",
        color: "#000",
        fontSize: 16,
    },
    gradient: {
        borderRadius: 12,
    },
    loginButton: {
        width: 130,
        height: 60,
        borderRadius: 12,
        alignItems: "center",
    },
    loginText: {
        lineHeight: 60,
        color: "white",
        fontSize: 16,
    },
    createAccountLink: {
        paddingVertical: 10,
    },
    createAccountText: {
        color: "#586994",
        fontSize: 20,
        marginTop: 20,
    },
});


export default styles;