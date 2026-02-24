import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nexast',
  description: 'Click-to-Broadcast. No OBS. Sub-second latency.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        >
          <Navbar />
          <Toaster
            position='top-center'
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--card-border)',
                boxShadow: 'var(--shadow-card)',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'center',
              },
            }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
