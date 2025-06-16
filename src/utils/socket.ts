// This file sets up a WebSocket connection using Socket.IO
// Ensure you have socket.io-client installed: npm install socket.io-client
// This file is used to connect to the backend server for real-time messaging
// and should be imported in components that need to use WebSockets
// such as chat components.
// zone-25-14-frontend/src/utils/socket.ts

import { io, Socket } from "socket.io-client";
import { User } from "@/types/User";

let socket: Socket | null = null;

export const initSocket = (user: User) => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
      auth: {
        userId: user.user_id, // used in backend socket handshake
      },
    });
    console.log("⚡ Socket initialized");
  }
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("❌ Socket not initialized. Call initSocket(user) first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected");
  }
};
