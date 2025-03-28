import { Stack } from "expo-router";
import { UserProvider } from "./context/UserContext";
import { WebSocketProvider } from "./context/WebSocketContext";

export default function RootLayout() {
  return (
    <WebSocketProvider>
      <UserProvider>
        <Stack />
      </UserProvider>
    </WebSocketProvider>
  );
}
