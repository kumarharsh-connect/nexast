'use client';

import { useEffect, useRef, useState } from 'react';
import { Radio, User, Loader2, Volume2, VolumeX, Eye } from 'lucide-react';
import { useViewSession } from '@/hooks/useViewSession';
import { useUser } from '@clerk/nextjs';
import LiveChat from '../chat/LiveChat';
import { useViewerCount } from '@/hooks/useViewerCount';

export default function StreamPlayer({
  username,
  stream,
}: {
  username: string;
  stream: {
    title?: string | null;
    category?: string | null;
    isLive?: boolean;
  } | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { remoteStream } = useViewSession(username);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const isLive = stream?.isLive ?? false;
  const { user, isLoaded } = useUser();
  const viewerCount = useViewerCount(username);

  const loggedUsername =
    user?.username ||
    user?.emailAddresses[0]?.emailAddress.split('@')[0] ||
    null;

  const [anonymousName, setAnonymousName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('anonymousName');
    if (stored) {
      setAnonymousName(stored);
    } else {
      const generated = `Anonymous_${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem('anonymousName', generated);
      setAnonymousName(generated);
    }
  }, []);

  const chatIdentity = loggedUsername || anonymousName || 'Anonymous';

  useEffect(() => {
    const video = videoRef.current;
    if (video && remoteStream) {
      video.srcObject = remoteStream;
      void video.play().catch(() => {});
    }
  }, [remoteStream]);

  return (
    <div className='min-h-screen flex flex-col xl:flex-row gap-8 p-4 md:p-6 lg:p-8 max-w-450 mx-auto'>
      {/* VIDEO AREA */}
      <div className='flex-1 min-h-0 flex flex-col gap-6'>
        {/* PLAYER CONTAINER */}
        <div className='w-full rounded-2xl overflow-hidden glass-panel border border-white/5 relative group'>
          {/* LIVE INDICATOR  */}
          {isLive && (
            <div className='absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-rose-500/30'>
              <span className='w-2 h-2 rounded-full bg-rose-500 animate-pulse'></span>
              <span className='text-xs font-bold tracking-widest text-white uppercase'>
                LIVE
              </span>
            </div>
          )}

          {/* LIVE AND CONNECTED*/}
          {remoteStream && (
            <div className='relative w-full aspect-video bg-black'>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isMuted}
                className='w-full aspect-video object-contain bg-black transition-opacity duration-500'
                onClick={() => setIsMuted(!isMuted)}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className='absolute bottom-6 right-6 z-10 bg-black/50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold backdrop-blur-md border border-white/10 hover:bg-black/80 hover:scale-105 transition-all shadow-xl flex items-center gap-2 opacity-0 group-hover:opacity-100 focus:opacity-100'
              >
                {isMuted ? (
                  <>
                    <VolumeX size={18} className='text-rose-500' />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={18} className='text-primary' />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* LIVE BUT CONNECTING  */}
          {!remoteStream && isLive && (
            <div className='w-full aspect-video flex flex-col items-center justify-center gap-5 bg-black/50 backdrop-blur-sm text-white'>
              <Loader2
                size={48}
                className='animate-spin text-primary drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              />
              <p className='text-sm font-medium tracking-wide text-(--foreground-muted) uppercase'>
                Establishing Connection...
              </p>
            </div>
          )}

          {/* OFFLINE */}
          {!remoteStream && !isLive && (
            <div className='w-full aspect-video flex flex-col items-center justify-center gap-4 bg-linear-to-b from-black/40 to-black/80 text-(--foreground-muted)'>
              <div className='p-5 rounded-full bg-white/5 border border-white/10 mb-2'>
                <Radio size={40} className='opacity-40' />
              </div>
              <p className='text-2xl font-semibold text-foreground tracking-tight'>
                Stream is Offline
              </p>
              <p className='text-sm flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5'>
                <User size={16} className='text-primary' />
                <span className='font-medium'>{username}</span>
              </p>
            </div>
          )}
        </div>

        {/* STREAM META DATA */}
        <div className='w-full flex flex-col gap-2 px-1'>
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground'>
                {stream?.title ?? 'Untitled Stream'}
              </h2>
              <div className='flex items-center gap-3 mt-2'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-full bg-linear-to-tr from-primary to-emerald-400 flex items-center justify-center text-black font-bold text-xs uppercase'>
                    {username.charAt(0)}
                  </div>
                  <span className='font-semibold text-foreground'>
                    {username}
                  </span>
                </div>
                <span className='text-(--foreground-muted)'>•</span>
                <p className='text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20'>
                  {stream?.category ?? 'No Category'}
                </p>

                {/* VIEWER COUNT  */}
                {isLive && (
                  <>
                    <span className='text-(--foreground-muted)'>•</span>
                    <div className='flex items-center gap-1.5 font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 transition-all'>
                      <Eye size={14} />
                      <span className='text-xs'>{viewerCount}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT SIDEBAR  */}
      <aside className='w-full xl:w-100 shrink-0 flex flex-col h-150 xl:h-[calc(100vh-6rem)] glass-panel overflow-hidden sticky top-6'>
        <div className='shrink-0 px-6 py-5 border-b border-border-glass bg-white/5 font-bold tracking-wide text-foreground flex items-center gap-3 uppercase text-sm'>
          <Radio size={18} className='text-primary animate-pulse' />
          Live Chat
        </div>

        {isLoaded ? (
          <LiveChat
            roomId={username}
            currentUser={chatIdentity}
            isLive={isLive}
            broadcaster={username}
          />
        ) : (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='animate-spin text-primary opacity-50' />
          </div>
        )}
      </aside>
    </div>
  );
}
