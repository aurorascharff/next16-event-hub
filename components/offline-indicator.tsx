'use client';

import { WifiOff } from 'lucide-react';
import { useOffline } from 'next/offline';

export function OfflineIndicator() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div
      data-offline=""
      className="bg-destructive text-destructive-foreground fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-50 flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium"
    >
      <WifiOff className="size-4" />
      You are offline
    </div>
  );
}
