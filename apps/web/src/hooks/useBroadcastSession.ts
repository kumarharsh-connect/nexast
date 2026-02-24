import { useEffect, useRef } from 'react';
import { createBroadcasterPeer } from '@/lib/webrtc/create-broadcaster-peer';
import { useSocket } from './useSocket';

import type Peer from 'simple-peer';

export function useBroadcastSession() {
  const socket = useSocket();
  const peersRef = useRef<Record<string, Peer.Instance>>({}); // <socketId, peerInstance>
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!socket) return;

    const ensurePeerForViewer = (socketId: string) => {
      const stream = streamRef.current;
      if (!stream) return;

      if (peersRef.current[socketId]) return;

      const peer = createBroadcasterPeer(stream, socket, socketId);
      peersRef.current[socketId] = peer;
    };

    const handleRoomUsers = ({ socketIds }: { socketIds: string[] }) => {
      socketIds.forEach(ensurePeerForViewer);
    };

    const handleUserJoined = ({ socketId }: { socketId: string }) => {
      ensurePeerForViewer(socketId);
    };

    const handleSignal = ({ sender, signal }: any) => {
      const peer = peersRef.current[sender];
      if (peer) {
        peer.signal(signal);
      }
    };

    const handleUserLeft = ({ socketId }: { socketId: string }) => {
      peersRef.current[socketId]?.destroy();
      delete peersRef.current[socketId];
    };

    socket.on('room-users', handleRoomUsers);
    socket.on('user-joined', handleUserJoined);
    socket.on('signal', handleSignal);
    socket.on('user-left', handleUserLeft);

    return () => {
      socket.off('room-users', handleRoomUsers);
      socket.off('user-joined', handleUserJoined);
      socket.off('signal', handleSignal);
      socket.off('user-left', handleUserLeft);
    };
  }, [socket]);

  const startBroadcast = (
    stream: MediaStream,
    roomId: string | null,
    username: string,
  ) => {
    if (!socket || !roomId) return;
    streamRef.current = stream;

    socket.emit('join-room', { roomId, username });
  };

  const stopBroadcast = () => {
    Object.values(peersRef.current).forEach((peer: any) => {
      peer.destroy();
    });

    peersRef.current = {};
    streamRef.current = null;
  };

  return { startBroadcast, stopBroadcast };
}
