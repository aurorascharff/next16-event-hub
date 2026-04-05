import { Space_Grotesk, Space_Mono } from 'next/font/google';
import { Suspense } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentUser } from '@/data/queries/auth';
import { AuthGate } from '@/components/AuthGate';
import type { Metadata } from 'next';

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
  description: 'Live event companion app — comments, questions, and live presence for conference sessions.',
  title: 'Event Hub',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="font-mono antialiased">
        <ThemeProvider>
          <Suspense>
            <AuthGateLoader />
          </Suspense>
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

async function AuthGateLoader() {
  const userName = await getCurrentUser();
  if (userName) return null;
  return <AuthGate />;
}
