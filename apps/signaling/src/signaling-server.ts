dotenv.config();
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_URL?.split(',') || [];
const app = express();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Socket logic
io.on('connection', (socket) => {
  console.log('🔌 Connected:', socket.id);

  const emitViewerCount = async (roomId: string) => {
    const sockets = await io.in(roomId).fetchSockets();
    const count = sockets.length - 1;
    io.to(roomId).emit('viewer-count', count);
  };

  // Join Room
  socket.on('join-room', async ({ roomId, username }) => {
    socket.join(roomId);

    socket.to(roomId).emit('user-joined', {
      socketId: socket.id,
    });
    console.log(`Socket: ${socket.id} joined room: ${roomId}`);

    // Notify room of new user
    if (username && username !== 'undefined') {
      io.to(roomId).emit('system-message', {
        message: `${username} joined the chat`,
        sender: 'System',
        timestamp: Date.now(),
      });
    }

    const socketsInRoom = await io.in(roomId).fetchSockets();
    const otherSocketIds = socketsInRoom
      .map((s) => s.id)
      .filter((id) => id !== socket.id);
    socket.emit('room-users', { socketIds: otherSocketIds });

    await emitViewerCount(roomId);
  });

  // Signal Forwarding
  socket.on('signal', ({ target, signal }) => {
    io.to(target).emit('signal', {
      sender: socket.id,
      signal,
    });
  });

  // Disconnect Handling
  socket.on('disconnecting', async () => {
    const rooms = [...socket.rooms].filter((r) => r !== socket.id);
    for (const roomId of rooms) {
      // Notify Chat
      io.to(roomId).emit('system-message', {
        message: `A user left the chat`,
        sender: 'System',
        timestamp: Date.now(),
      });
      // Notify WebRTC
      socket.to(roomId).emit('user-left', {
        socketId: socket.id,
      });

      const sockets = await io.in(roomId).fetchSockets();
      const count = Math.max(0, sockets.length - 1);
      io.to(roomId).emit('viewer-count', count);
    }

    console.log('Disconnected:', socket.id);
  });

  // Chat Message
  socket.on('chat-message', ({ roomId, message, sender }) => {
    io.to(roomId).emit('chat-message', {
      message,
      sender,
      timestamp: Date.now(),
    });
  });
});

// Boot
server.listen(PORT, () => {
  console.log(`Nexast signaling server running on Port ${PORT}`);
});
