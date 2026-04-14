import { Space_Grotesk, Space_Mono } from 'next/font/google';
import { Suspense } from 'react';
import { AuthGate } from '@/components/common/AuthGate';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentUser } from '@/data/queries/auth';
import type { Metadata, Viewport } from 'next';

import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Event Hub',
  },
  description: 'Live event companion app — comments, questions, and favorites for conference sessions.',
  icons: {
    icon: '/favicon.png',
  },
  manifest: '/manifest.json',
  title: 'Event Hub',
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-mono antialiased">
        <ThemeProvider>
          <Suspense>
            <AuthGate userPromise={getCurrentUser()} />
          </Suspense>
          <div
            className="bg-background fixed inset-x-0 top-0 z-50 h-[env(safe-area-inset-top)]"
            style={{ viewTransitionName: 'safe-area-top' }}
          />
          <main className="pt-[env(safe-area-inset-top)]">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
