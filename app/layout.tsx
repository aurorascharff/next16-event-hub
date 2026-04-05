import { Space_Grotesk, Space_Mono } from 'next/font/google';
import { Suspense } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentUser } from '@/data/queries/auth';
import { AuthGate } from './_components/AuthGate';
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
  description: 'Live session companion for React Miami 2026 — comments, questions, and live presence.',
  title: 'Event Hub | React Miami 2026',
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
          <ThemeToggle />
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
