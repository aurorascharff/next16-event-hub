'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

export function usePolling(intervalMs = 5000) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(() => {
        router.refresh();
      });
    }, intervalMs);
    return () => {
      clearInterval(interval);
    };
  }, [router, intervalMs]);
}
