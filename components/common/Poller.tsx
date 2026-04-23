'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  intervalMs?: number;
};

export function Poller({ intervalMs = 5000 }: Props) {
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

  return null;
}
