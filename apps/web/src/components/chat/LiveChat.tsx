'use client';
import { useChatSession } from '@/hooks/useChatSession';
import { useState, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import clsx from 'clsx';

export default function LiveChat({
  roomId,
  currentUser,
  broadcaster,
  isLive = true,
}: {
  roomId: string;
  currentUser: string;
  broadcaster?: string;
  isLive?: boolean;
}) {
  const { messages, sendMessage } = useChatSession(roomId, currentUser);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (!isLive || !input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className='flex flex-col flex-1 min-h-0 bg-transparent'>
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto px-5 py-4 space-y-4 text-sm custom-scrollbar flex flex-col'
      >
        {messages.length === 0 ? (
          <div className='flex-1 flex items-center justify-center text-center text-(--foreground-muted)/60 italic px-4'>
            Welcome to the chat room! Messages will appear here.
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender === currentUser;

            return (
              <div
                key={i}
                className={clsx(
                  'flex flex-col w-full',
                  isMe ? 'items-end' : 'items-start',
                )}
              >
                {msg.sender === 'System' ? (
                  <div className='w-full text-xs text-(--foreground-muted) italic text-center my-2 py-1 border-y border-white/5'>
                    {msg.message}
                  </div>
                ) : (
                  <div
                    className={clsx(
                      'max-w-[85%] flex flex-col',
                      isMe ? 'items-end' : 'items-start',
                    )}
                  >
                    <span className='mb-1 text-[11px] font-bold tracking-wide uppercase opacity-70 px-1'>
                      {isMe ? (
                        'You'
                      ) : msg.sender === broadcaster ? (
                        <span className='text-primary flex items-center gap-1'>
                          {msg.sender}
                          <span className='bg-primary text-[9px] text-black px-1 rounded-sm'>
                            HOST
                          </span>
                        </span>
                      ) : (
                        msg.sender
                      )}
                    </span>

                    <div
                      className={clsx(
                        'px-4 py-2.5 rounded-2xl wrap-break-words text-sm shadow-md',
                        isMe
                          ? 'bg-primary text-black rounded-tr-sm'
                          : 'bg-white/10 text-foreground border border-white/5 rounded-tl-sm',
                      )}
                    >
                      {msg.message}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div
        className={`shrink-0 p-4 border-t border-border-glass bg-black/20 backdrop-blur-md ${!isLive ? 'opacity-60 grayscale' : ''}`}
      >
        <div className='relative flex items-center'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => isLive && e.key === 'Enter' && handleSend()}
            disabled={!isLive}
            autoComplete='off'
            className='w-full bg-(--input-bg) border border-border-glass text-foreground placeholder:text-(--foreground-muted)/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 pl-4 pr-14 py-3.5 rounded-xl text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-inner'
            placeholder={
              isLive ? 'Send a message...' : 'Stream must be live to chat'
            }
          />
          <button
            onClick={handleSend}
            disabled={!isLive || !input.trim()}
            className='absolute right-2 p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed'
            title='Send Message'
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
