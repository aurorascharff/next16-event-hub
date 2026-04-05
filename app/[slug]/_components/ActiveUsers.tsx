'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { recordPresence } from '@/data/actions/presence';
import { getAvatarUrl } from '@/lib/utils';

type ActiveUser = {
  userName: string;
  lastSeen: string;
};

const fetcher = (url: string) => {return fetch(url).then(res => {return res.json()})};

type Props = {
  eventSlug: string;
  currentUser: string | null;
};

export function ActiveUsers({ eventSlug, currentUser }: Props) {
  const { data: users } = useSWR<ActiveUser[]>(
    `/api/events/${eventSlug}/presence`,
    fetcher,
    { refreshInterval: 5000 },
  );

  useEffect(() => {
    if (!currentUser) return;

    recordPresence(eventSlug);
    const interval = setInterval(() => {
      recordPresence(eventSlug);
    }, 10_000);

    return () => {
      clearInterval(interval);
    };
  }, [eventSlug, currentUser]);

  const count = users?.length ?? 0;

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1.5">
        {(users ?? []).slice(0, 5).map(user => {
          return (
            <img
              key={user.userName}
              src={getAvatarUrl(user.userName)}
              alt={user.userName}
              title={user.userName}
              className="size-5 rounded-full border-2 border-background"
            />
          );
        })}
      </div>
      <span className="text-muted-foreground text-[10px]">
        <span className="text-primary font-bold">{count}</span> here now
      </span>
    </div>
  );
}
