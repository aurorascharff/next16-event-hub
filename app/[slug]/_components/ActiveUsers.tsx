'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { recordPresence } from '@/data/actions/presence';
import { useIsClient } from '@/hooks/useIsClient';

type ActiveUser = {
  userName: string;
  lastSeen: string;
};

const fetcher = (url: string) => {return fetch(url).then(res => {return res.json()})};

type Props = {
  eventSlug: string;
};

export function ActiveUsers({ eventSlug }: Props) {
  const isClient = useIsClient();

  const { data: users } = useSWR<ActiveUser[]>(
    isClient ? `/api/events/${eventSlug}/presence` : null,
    fetcher,
    { refreshInterval: 5000 },
  );

  useEffect(() => {
    recordPresence(eventSlug);
    const interval = setInterval(() => {
      recordPresence(eventSlug);
    }, 10_000);

    return () => {
      clearInterval(interval);
    };
  }, [eventSlug]);

  const count = users?.length ?? 0;

  if (count === 0) return null;

  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <span className="bg-emerald-500 inline-block size-1.5 animate-pulse rounded-full" />
      {count} here
    </span>
  );
}
