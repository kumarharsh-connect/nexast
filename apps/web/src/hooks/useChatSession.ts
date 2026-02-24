'use client';

import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';

type ChatMessage = {
  message: string;
  sender: string;
  timestamp: number;
};

export function useChatSession(roomId: string, currentUser: string) {
  const socket = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!socket) return;

    // join room with identity
    socket.emit('join-room', { roomId, username: currentUser });

    const handleChat = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleSystem = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('chat-message', handleChat);
    socket.on('system-message', handleSystem);

    return () => {
      socket.off('chat-message', handleChat);
      socket.off('system-message', handleSystem);
    };
  }, [socket, roomId, currentUser]);

  const sendMessage = (message: string) => {
    if (!socket || !message.trim()) return;

    socket.emit('chat-message', {
      roomId,
      message,
      sender: currentUser,
    });
  };

  return { messages, sendMessage };
}
