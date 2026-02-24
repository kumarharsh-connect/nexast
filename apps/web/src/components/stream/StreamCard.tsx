'use client';

import Link from 'next/link';
import { Eye, Play } from 'lucide-react';
import { useViewerCount } from '@/hooks/useViewerCount';

interface StreamData {
  id: string;
  title: string | null;
  category: string | null;
  user: {
    username: string;
  };
}

interface StreamCardProps {
  stream: StreamData;
}

export default function StreamCard({ stream }: StreamCardProps) {
  const viewerCount = useViewerCount(stream.user.username);

  return (
    <Link
      href={`/channel/${stream.user.username}`}
      className='group relative flex flex-col overflow-hidden rounded-2xl glass-panel border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-(--glow-secondary)'
    >
      {/* Thumbnail Area */}
      <div className='aspect-video bg-black relative overflow-hidden'>
        <div className='absolute inset-0 bg-linear-to-br from-zinc-800 to-zinc-950 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center'>
          {/* Avatar */}
          <div className='shrink-0 w-15 h-15 rounded-full bg-linear-to-tr from-primary to-emerald-400 p-0.5'>
            <div className='w-full h-full rounded-full bg-black flex items-center justify-center'>
              <span className='text-xs font-bold text-white uppercase'>
                {stream.user.username.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Live Badge */}
        <div className='absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-widest bg-rose-600 text-white rounded-md shadow-lg z-10'>
          <span className='w-1.5 h-1.5 rounded-full bg-white animate-pulse'></span>
          LIVE
        </div>

        {/* Viewer Count  */}
        <div className='absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-mono font-medium text-white/90 border border-white/10'>
          <Eye size={14} className='text-primary' />
          <span>{viewerCount}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className='p-5 flex flex-col gap-3 flex-1 bg-linear-to-b from-transparent to-black/20'>
        <div className='flex gap-3'>
          <div className='flex flex-col min-w-0'>
            <h2 className='font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors leading-tight'>
              {stream.title || 'Untitled Stream'}
            </h2>
            <p className='text-sm text-(--foreground-muted) mt-1 truncate'>
              @{stream.user.username}
            </p>
          </div>
        </div>

        <div className='mt-auto pt-3 flex items-center justify-between border-t border-white/5'>
          <span className='text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 truncate max-w-30'>
            {stream.category || 'Just Chatting'}
          </span>
        </div>
      </div>
    </Link>
  );
}
