'use client';

import Link from 'next/link';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { Radio, Clapperboard, LogIn } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className='sticky top-0 z-50 w-full h-16 border-b border-white/5 bg-[#030708]/80 backdrop-blur-xl supports-backdrop-filter:bg-[#030708]/60'>
      <div className='max-w-450 mx-auto px-4 md:px-8 h-full flex items-center justify-between'>
        {/* Logo Section */}
        <Link href='/' className='flex items-center gap-2 group'>
          <div className='p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-primary/20 group-hover:bg-primary/10 transition-colors'>
            <Radio
              size={20}
              className='text-primary group-hover:animate-pulse'
            />
          </div>
          <span className='text-xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-white/70 group-hover:to-primary transition-all'>
            Nexast
          </span>
        </Link>

        {/* Search Bar */}
        <SearchBar />

        {/* Actions Section */}
        <div className='flex items-center gap-4 md:gap-6'>
          {isSignedIn && (
            <Link
              href='/dashboard'
              className='hidden md:flex items-center gap-2 text-sm font-medium text-(--foreground-muted) hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-white/5'
            >
              <Clapperboard size={18} />
              <span>Go Live</span>
            </Link>
          )}

          {isSignedIn ? (
            <div className='flex items-center gap-4 pl-4 border-l border-white/10'>
              <UserButton
                afterSignOutUrl='/'
                appearance={{
                  elements: {
                    avatarBox:
                      'w-9 h-9 border border-white/10 ring-2 ring-transparent hover:ring-primary/20 transition-all',
                  },
                }}
              />
            </div>
          ) : (
            <SignInButton mode='modal'>
              <button className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-[#030708] font-bold text-sm transition-all hover:bg-(--primary-hover) hover:shadow-(--glow-primary) hover:-translate-y-0.5'>
                <LogIn size={16} strokeWidth={2.5} />
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
