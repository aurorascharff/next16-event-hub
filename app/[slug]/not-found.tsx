import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100dvh-env(safe-area-inset-top))] flex-col items-center justify-center gap-4">
      <h1 className="font-sans text-2xl font-bold">Session not found</h1>
      <p className="text-muted-foreground text-sm">This session doesn&apos;t exist or has been removed.</p>
      <Link href="/" className="text-primary text-sm hover:underline">
        ← Back to sessions
      </Link>
    </div>
  );
}
