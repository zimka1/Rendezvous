import React, { useState } from "react";
import styles from "./LoginStyles";
import {
    Keyboard,
    TouchableWithoutFeedback,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GoogleIcon } from "./LoginIcon";
import { Stack, useRouter } from "expo-router";
import { useUser } from "./context/UserContext";
import { useWebSocket } from "./context/WebSocketContext";

export default function LoginScreen() {
    const router = useRouter();
    const { setUserId } = useUser();
    const { sendJson } = useWebSocket(); // ✅ Используем sendJson из контекста

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const sendLogin = async () => {
        try {
            const response = await fetch("http://172.20.10.8:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                Alert.alert("Login Failed", errorText);
            } else {
                const json = await response.json();
                console.log("✅ Logged in, user ID:", json.user_id);
                setUserId(json.user_id);

                // ✅ Отправляем user_id в сокет через контекст
                sendJson({
                    command: "login",
                    user_id: json.user_id,
                });

                router.push("/chatList");
            }
        } catch (error: any) {
            Alert.alert("Network Error", error.message);
        }
    };

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Please enter both email and password.");
            return;
        }
        sendLogin();
    };

    const handleGoogleSignIn = () => {
        console.log("Google sign-in pressed");
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                        <GoogleIcon size={20} />
                        <Text style={styles.googleText}>Sign in with Google</Text>
                    </TouchableOpacity>

                    <LinearGradient
                        colors={["#F77F00", "#FF4081"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    <TouchableOpacity
                        onPress={() => router.push("/Registration")}
                        style={styles.createAccountLink}
                    >
                        <Text style={styles.createAccountText}>Create new account</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}
