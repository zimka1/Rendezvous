import React, {
    createContext,
    useContext,
    useRef,
    useEffect,
    useState,
  } from "react";
  
  type WebSocketContextType = {
    socket: WebSocket | null;
    sendJson: (data: any) => void;
  };
  
  const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    sendJson: () => {},
  });
  
  export const WebSocketProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null); // ✅ добавлено
  
    useEffect(() => {
      const ws = new WebSocket("ws://172.20.10.8:8080");
      socketRef.current = ws;
      setSocket(ws); // ✅ сохраняем в стейт, чтобы триггерить ререндер
  
      ws.onopen = () => {
        console.log("🟢 WebSocket connected");
      };
  
      ws.onmessage = (event) => {
        console.log("📩 Message from server:", event.data);
      };
  
      ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
      };
  
      ws.onclose = () => {
        console.log("🔌 WebSocket disconnected");
      };
  
      return () => {
        ws.close();
      };
    }, []);
  
    const sendJson = (data: any) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(data));
        console.log("📤 Sent:", data);
      } else {
        console.warn("⚠️ WebSocket not open");
      }
    };
  
    return (
      <WebSocketContext.Provider value={{ socket, sendJson }}>
        {children}
      </WebSocketContext.Provider>
    );
  };
  
  export const useWebSocket = () => useContext(WebSocketContext);
  