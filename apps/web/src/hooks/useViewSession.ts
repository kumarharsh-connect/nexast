import { useEffect, useRef, useState } from 'react';
import { useSocket } from './useSocket';
import Peer from 'simple-peer';

export function useViewSession(roomId: string) {
  const socket = useSocket();
  const peerRef = useRef<Peer.Instance | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', { roomId });

    const handleSignal = ({ sender, signal }: any) => {
      if (!peerRef.current) {
        const peer = new Peer({
          initiator: false,
          trickle: false,
        });

        peer.on('signal', (answer) => {
          socket.emit('signal', {
            target: sender,
            signal: answer,
          });
        });

        peer.on('stream', (stream) => {
          setRemoteStream(stream);
        });

        peer.signal(signal);
        peerRef.current = peer;
      } else {
        peerRef.current.signal(signal);
      }
    };

    socket.on('signal', handleSignal);

    return () => {
      socket.off('signal', handleSignal);
      peerRef.current?.destroy();
      peerRef.current = null;
    };
  }, [socket, roomId]);

  return { remoteStream };
}
