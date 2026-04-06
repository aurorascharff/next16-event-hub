'use client';

import Link from 'next/link';

export default function SlugError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-sans text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground text-sm">An error occurred while loading this session.</p>
      <div className="flex gap-4">
        <button onClick={reset} className="text-primary text-sm hover:underline">
          Try again
        </button>
        <Link href="/" className="text-primary text-sm hover:underline">
          ← Back to sessions
        </Link>
      </div>
    </div>
  );
}
