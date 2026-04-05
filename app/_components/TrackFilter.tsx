'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn, TRACKS } from '@/lib/utils';

export function TrackFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTrack = searchParams.get('track') || 'all';
  const activeDay = searchParams.get('day') || '';
  const [optimisticTrack, setOptimisticTrack] = useOptimistic(activeTrack);
  const [isPending, startTransition] = useTransition();

  const allTabs = [{ label: 'All tracks', value: 'all' }, ...TRACKS];

  function handleChange(value: string) {
    startTransition(async () => {
      setOptimisticTrack(value);
      const params = new URLSearchParams();
      if (activeDay) params.set('day', activeDay);
      if (value !== 'all') params.set('track', value);
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : '/');
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        {allTabs.map(tab => {
          const isActive = tab.value === optimisticTrack;
          return (
            <button
              key={tab.value}
              onClick={() => {
                handleChange(tab.value);
              }}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs transition-colors',
                isActive
                  ? 'bg-foreground text-background font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {isPending && <Spinner />}
    </div>
  );
}
