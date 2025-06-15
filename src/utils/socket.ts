// This file sets up a WebSocket connection using Socket.IO
// Ensure you have socket.io-client installed: npm install socket.io-client
// This file is used to connect to the backend server for real-time messaging
// and should be imported in components that need to use WebSockets
// such as chat components.
// zone-25-14-frontend/src/utils/socket.ts
import { io, Socket } from "socket.io-client";
const URL = "http://localhost:5000"; // or your backend server
const socket: Socket = io(URL, { withCredentials: true });

export default socket;
