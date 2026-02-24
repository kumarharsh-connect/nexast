'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Radio,
  CameraOff,
  Eye,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import { useUser } from '@clerk/nextjs';

import { useMedia } from '@/hooks/useMedia';
import { useBroadcastSession } from '@/hooks/useBroadcastSession';
import { markStreamLive, markStreamOffline } from '@/server/stream';
import { ControlButton } from '@/components/ui/ControlButton';
import LiveChat from '../chat/LiveChat';
import { toast } from 'react-hot-toast';
import { useViewerCount } from '@/hooks/useViewerCount';

export default function Cockpit({ username }: { username: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useUser();

  const { stream, isScreenSharing, toggleScreenShare } = useMedia();
  const { startBroadcast, stopBroadcast } = useBroadcastSession();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const [isLive, setIsLive] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const viewerCount = useViewerCount(username);

  useEffect(() => {
    if (videoRef.current && stream && camOn) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream, camOn]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (isLive) {
        await markStreamOffline();
        stopBroadcast();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLive]);

  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => (track.enabled = !micOn));
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => (track.enabled = !camOn));
    setCamOn(!camOn);
  };

  const handleBroadcastToggle = async () => {
    if (!user || !stream) return;

    setIsPending(true);

    try {
      if (!isLive) {
        if (!title.trim()) {
          toast.error('Please enter the stream title.');
          return;
        }
        await markStreamLive(title, category);
        startBroadcast(stream, username, username);
        setIsLive(true);
      } else {
        await markStreamOffline();
        stopBroadcast();
        setIsLive(false);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className='min-h-screen px-4 md:px-8 py-8 lg:py-12 max-w-450 mx-auto'>
      {/* Header */}
      <div className='mb-10'>
        <h1 className='text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-(--foreground-muted) tracking-tight'>
          Creator Cockpit
        </h1>
        <p className='text-(--foreground-muted) mt-2 text-lg font-medium'>
          Configure your setup and broadcast to the world.
        </p>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 items-start'>
        {/* Left Side: Setup & Preview */}
        <div className='flex flex-col gap-8'>
          {/* Stream Settings */}
          <div className='glass-panel p-6 md:p-8'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='flex flex-col gap-3'>
                <label className='text-xs font-bold uppercase tracking-widest text-primary ml-1'>
                  Stream Title
                </label>
                <input
                  placeholder='Enter an engaging title...'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLive}
                  className='px-5 py-4 rounded-xl bg-(--input-bg) border border-border-glass text-foreground placeholder:text-(--foreground-muted)/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner disabled:opacity-60'
                />
              </div>
              <div className='flex flex-col gap-3'>
                <label className='text-xs font-bold uppercase tracking-widest text-primary ml-1'>
                  Category
                </label>
                <input
                  placeholder='e.g. Gaming, Just Chatting, Music...'
                  value={category}
                  disabled={isLive}
                  onChange={(e) => setCategory(e.target.value)}
                  className='px-5 py-4 rounded-xl bg-(--input-bg) border border-border-glass text-foreground placeholder:text-(--foreground-muted)/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner disabled:opacity-60'
                />
              </div>
            </div>
          </div>

          {/* Webcam Preview */}
          <div className='relative glass-panel overflow-hidden bg-black/40 ring-1 ring-white/5'>
            {isLive && (
              <div className='absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-rose-500/30'>
                <span className='w-2 h-2 rounded-full bg-rose-500 animate-pulse'></span>
                <span className='text-xs font-bold tracking-widest text-white uppercase'>
                  LIVE
                </span>
                <span className='mx-2'>|</span>
                <Eye size={14} />
                <span className='text-xs font-bold tracking-widest text-white'>
                  {viewerCount}
                </span>
              </div>
            )}
            {camOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className='w-full aspect-video object-cover'
              ></video>
            ) : (
              <div className='w-full aspect-video flex flex-col items-center justify-center text-(--foreground-muted) bg-linear-to-b from-transparent to-black/50'>
                <CameraOff
                  size={56}
                  className='mb-4 opacity-30 text-white'
                  strokeWidth={1.5}
                />
                <span className='text-xl font-medium text-white tracking-wide'>
                  Camera is Offline
                </span>
                <span className='text-sm text-(--foreground-muted) mt-2'>
                  Enable the camera below to check your framing.
                </span>
              </div>
            )}

            {/* Controls */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-black/60 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl'>
              <ControlButton
                active={micOn}
                onClick={toggleMic}
                className={clsx(
                  !micOn &&
                    'bg-rose-500/20 text-rose-500 border-rose-500/30 hover:bg-rose-500/30',
                )}
              >
                {micOn ? <Mic size={22} /> : <MicOff size={22} />}
              </ControlButton>
              <ControlButton
                active={camOn}
                onClick={toggleCam}
                className={clsx(
                  !camOn &&
                    'bg-rose-500/20 text-rose-500 border-rose-500/30 hover:bg-rose-500/30',
                )}
              >
                {camOn ? <Video size={22} /> : <VideoOff size={22} />}
              </ControlButton>
              <ControlButton
                active={isScreenSharing}
                onClick={toggleScreenShare}
                className={clsx(
                  isScreenSharing &&
                    'bg-rose-500/20 text-rose-500 border-rose-500/30 hover:bg-rose-500/30',
                )}
              >
                {isScreenSharing ? (
                  <Monitor size={22} />
                ) : (
                  <MonitorOff size={22} />
                )}
              </ControlButton>
            </div>
          </div>

          <button
            onClick={handleBroadcastToggle}
            disabled={isPending}
            className={clsx(
              'group relative overflow-hidden w-full py-5 rounded-2xl font-black text-xl tracking-widest uppercase transition-all duration-300 transform active:scale-[0.98]',
              isLive
                ? 'bg-rose-500/10 border border-rose-500/50 text-rose-500 hover:bg-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
                : 'bg-primary text-background hover:bg-(--primary-hover) hover:text-black',
            )}
            style={
              !isLive && !isPending
                ? { boxShadow: 'var(--glow-primary)' }
                : undefined
            }
          >
            <div className='relative z-10 flex items-center justify-center gap-3'>
              {isPending ? (
                <>
                  <Loader2 size={24} className='animate-spin' />
                  {isLive ? 'Ending Broadcast...' : 'Going Live...'}
                </>
              ) : (
                <>
                  <span
                    className={clsx(
                      'w-3 h-3 rounded-full animate-pulse',
                      isLive ? 'bg-rose-500' : 'bg-black',
                    )}
                  ></span>
                  {isLive ? 'End Broadcast' : 'Go Live Now'}
                </>
              )}
            </div>
          </button>
        </div>

        {/* Right Side: Chat Panel */}
        <aside className='flex flex-col h-175 xl:h-[calc(100vh-6rem)] sticky top-6 glass-panel overflow-hidden'>
          <div className='shrink-0 px-6 py-5 border-b border-border-glass bg-white/5 font-bold text-foreground tracking-wide flex items-center gap-3 uppercase text-sm'>
            <Radio size={18} className='text-primary animate-pulse' />
            Studio Chat
          </div>
          <LiveChat
            roomId={username}
            currentUser={username}
            isLive={isLive}
            broadcaster={username}
          />
        </aside>
      </div>
    </div>
  );
}
