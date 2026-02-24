import { useSocket } from './useSocket';
import { useEffect, useState } from 'react';

export function useViewerCount(roomId: string) {
  const socket = useSocket();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleCount = (newCount: number) => {
      setCount(newCount);
    };

    socket.on('viewer-count', handleCount);

    return () => {
      socket.off('viewer-count', handleCount);
    };
  }, [socket, roomId]);

  return count;
}
