'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function usePolling(intervalMs = 5000) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, intervalMs);

    const onFocus = () => {
      router.refresh();
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [router, intervalMs]);
}
