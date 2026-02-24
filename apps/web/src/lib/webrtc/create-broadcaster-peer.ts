import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';

export function createBroadcasterPeer(
  stream: MediaStream,
  socket: Socket,
  viewerSocketId: string,
) {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });

  peer.on('signal', (offer) => {
    socket.emit('signal', {
      target: viewerSocketId,
      signal: offer,
    });
  });

  peer.on('connect', () => {
    console.log('Viewer connected: ', viewerSocketId);
  });

  peer.on('error', (err) => {
    console.log('Peer error: ', err);
  });

  return peer;
}
