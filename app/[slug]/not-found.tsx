import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

export default function NotFound() {
  return (
    <PageShell className="flex flex-col items-center justify-center gap-4">
      <h1 className="font-sans text-2xl font-bold">Session not found</h1>
      <p className="text-muted-foreground text-sm">This session doesn&apos;t exist or has been removed.</p>
      <Link href="/" className="text-primary text-sm hover:underline">
        ← Back to sessions
      </Link>
    </PageShell>
  );
}
