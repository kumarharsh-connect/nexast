import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Setup
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Socket logic
io.on('connection', (socket) => {
  console.log('🔌 Connected:', socket.id);

  // Join Room
  socket.on('join-room', async ({ roomId }) => {
    socket.join(roomId);
    console.log(`Socket: ${socket.id} has joined the Room: ${roomId}`);

    const socketsInRoom = await io.in(roomId).fetchSockets();
    const otherSocketIds = socketsInRoom
      .map((s) => s.id)
      .filter((id) => id !== socket.id);
    socket.emit('room-users', { socketIds: otherSocketIds });

    socket.to(roomId).emit('user-joined', {
      socketId: socket.id,
    });
  });

  // Signal Forwarding
  socket.on('signal', ({ target, signal }) => {
    io.to(target).emit('signal', {
      sender: socket.id,
      signal,
    });
  });

  // Disconnect Handling
  socket.on('disconnect', () => {
    const rooms = [...socket.rooms].filter((r) => r !== socket.id);
    rooms.forEach((roomId) => {
      socket.to(roomId).emit('user-left', {
        socketId: socket.id,
      });
    });
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
server.listen(5000, () => {
  console.log('Nexast signaling server running on port 5000');
});
