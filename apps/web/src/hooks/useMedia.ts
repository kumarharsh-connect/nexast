import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export function useMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (mounted) {
          streamRef.current = media;
          setStream(media);
        } else {
          media.getTracks().forEach((t) => t.stop());
        }
      } catch (error) {
        console.error('Media init failed', error);
        toast.error('Could not access camera/microphone');
      }
    }

    init();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await switchToWebcam();
    } else {
      await switchToScreen();
    }
  };

  const switchToScreen = async () => {
    const currentStream = streamRef.current;
    if (!currentStream) return;

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      screenTrack.onended = () => {
        switchToWebcam();
      };

      const videoTrack = currentStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
        currentStream.removeTrack(videoTrack);
      }

      currentStream.addTrack(screenTrack);
      setStream(new MediaStream(currentStream.getTracks()));
      setIsScreenSharing(true);
    } catch (error) {
      toast.error('Screen share cancelled');
    }
  };

  const switchToWebcam = async () => {
    const currentStream = streamRef.current;
    if (!currentStream) return;

    try {
      const camStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const camTrack = camStream.getVideoTracks()[0];

      const videoTrack = currentStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
        currentStream.removeTrack(videoTrack);
      }

      currentStream.addTrack(camTrack);
      setStream(new MediaStream(currentStream.getTracks()));
      setIsScreenSharing(false);
    } catch (error) {
      toast.error('Failed to switch back to camera');
    }
  };

  return { stream, isScreenSharing, toggleScreenShare };
}
