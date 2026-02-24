'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

type Stream = {
  id: string;
  title: string | null;
  user: {
    username: string;
  };
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stream[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();

      setResults(data);
      setIsOpen(true);
    }, 400);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className='relative w-72'>
      <div className='flex items-center bg-(--input-bg) border border-border-glass rounded-xl px-3 py-2'>
        <Search size={16} className='text-(--foreground-muted) mr-2' />
        <input
          type='text'
          placeholder='Search streams or users...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-(--foreground-muted)'
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className='absolute mt-2 w-full bg-card border border-border-glass rounded-xl shadow-xl z-50'>
          {results.map((stream) => (
            <Link
              key={stream.id}
              href={`/channel/${stream.user.username}`}
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className='block px-4 py-3 hover:bg-(--background-elevate) transition-colors'
            >
              <p className='font-medium text-foreground'>
                {stream.title ?? 'Untitled Stream'}
              </p>{' '}
              <p className='text-xs text-(--foreground-muted)'>
                @{stream.user.username}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
