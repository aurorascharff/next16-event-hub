'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { useIsClient } from '@/lib/useIsClient';
import { Avatar } from '@/components/common/Avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { recordPresence } from '@/data/actions/presence';

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
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1.5">
        {(users ?? []).slice(0, 5).map(user => {
          return (
            <Tooltip key={user.userName}>
              <TooltipTrigger render={
                <Avatar
                  name={user.userName}
                  className="border-background border-2"
                />
              } />
              <TooltipContent>{user.userName}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <span className="text-muted-foreground text-xs">
        <span className="text-primary font-bold">{count}</span> here now
      </span>
    </div>
  );
}
