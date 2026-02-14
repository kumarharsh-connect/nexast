import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

type Role = 'broadcaster' | 'viewer';

interface JoinRoomPayload {
  roomId: string;
  role: Role;
  username: string;
}

interface SignalPayload {
  to: string;
  signal: any; // signal object
}

io.on('connection', (socket) => {
  console.log('🔌 Connected:', socket.id);

  socket.on('join-room', ({ roomId, role, username }: JoinRoomPayload) => {
    socket.join(roomId);
    socket.data.role = role;
    socket.data.username = username;

    console.log(`${username} joined ${roomId} as ${role}`);

    if (role === 'viewer') {
      socket.to(roomId).emit('viewer-joined', {
        viewerId: socket.id,
        username,
      });
    }
  });

  socket.on('signal', ({ to, signal }: SignalPayload) => {
    io.to(to).emit('signal', {
      from: socket.id,
      signal,
    });
  });

  socket.on('stream-started', ({ roomId }) => {
    socket.to(roomId).emit('stream-live');
  });

  socket.on('chat-message', ({ roomId, message }) => {
    io.to(roomId).emit('chat-message', {
      sender: socket.data.username,
      message,
      timestamp: Date.now(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Nexast signaling server running on port ${PORT}`);
});
