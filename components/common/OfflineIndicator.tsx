'use client';

import { useOffline } from 'next/offline';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function OfflineIndicator() {
  const isOffline = useOffline();

  useEffect(() => {
    if (isOffline) {
      toast.error('You are offline — reconnecting...', { duration: Infinity, id: 'offline' });
    } else {
      toast.dismiss('offline');
    }
  }, [isOffline]);

  return null;
}
