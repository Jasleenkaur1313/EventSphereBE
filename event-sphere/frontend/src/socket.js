import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9001';

// Single shared socket instance — connect/disconnect is managed by App.jsx
const socket = io(BACKEND_URL, {
  autoConnect: false,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

export default socket;
