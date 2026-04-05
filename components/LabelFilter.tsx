'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn, LABELS } from '@/lib/utils';

export function LabelFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLabel = searchParams.get('label') || 'all';
  const activeDay = searchParams.get('day') || 'day-1';
  const [optimisticLabel, setOptimisticLabel] = useOptimistic(activeLabel);
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      setOptimisticLabel(value);
      const params = new URLSearchParams();
      if (activeDay) params.set('day', activeDay);
      if (value !== 'all') params.set('label', value);
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : '/');
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => {
            handleChange('all');
          }}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs transition-colors',
            optimisticLabel === 'all'
              ? 'bg-foreground text-background font-medium'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          All
        </button>
        {LABELS.map(label => {
          const isActive = label === optimisticLabel;
          return (
            <button
              key={label}
              onClick={() => {
                handleChange(label);
              }}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs capitalize transition-colors',
                isActive
                  ? 'bg-foreground text-background font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      {isPending && <Spinner />}
    </div>
  );
}
