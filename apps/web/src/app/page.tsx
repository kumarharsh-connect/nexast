export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getLiveStreams } from '@/server/stream';
import { Radio, Signal } from 'lucide-react';
import StreamCard from '@/components/stream/StreamCard';

export default async function HomePage() {
  const streams = await getLiveStreams();

  return (
    <main className='min-h-screen bg-background px-4 md:px-8 py-12 max-w-450 mx-auto'>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-12'>
        <div>
          <h1 className='text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-(--foreground-muted) tracking-tight mb-2'>
            Live Now
          </h1>
          <p className='text-(--foreground-muted) text-lg'>
            Discover trending streams and join the action.
          </p>
        </div>

        <div className='hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500'>
          <Signal size={18} className='animate-pulse' />
          <span className='font-bold text-sm tracking-widest'>
            {streams.length} ONLINE
          </span>
        </div>
      </div>

      {streams.length === 0 ? (
        /* Empty State */
        <div className='flex flex-col items-center justify-center py-32 text-center space-y-6 glass-panel border-dashed border-white/10'>
          <div className='p-6 rounded-full bg-white/5 border border-white/10'>
            <Radio size={48} className='text-(--foreground-muted) opacity-50' />
          </div>
          <div className='max-w-md space-y-2'>
            <h2 className='text-2xl font-bold text-foreground'>
              No one is live right now
            </h2>
            <p className='text-(--foreground-muted)'>
              The airwaves are silent. Be the pioneer and start the first
              broadcast of the day!
            </p>
          </div>
          <Link
            href='/dashboard'
            className='px-8 py-3 bg-primary text-black font-bold rounded-xl hover:bg-(--primary-hover) hover:shadow-(--glow-primary) transition-all'
          >
            Start Streaming
          </Link>
        </div>
      ) : (
        /* Stream Grid */
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {streams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      )}
    </main>
  );
}
