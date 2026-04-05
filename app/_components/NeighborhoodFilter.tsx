'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn, NEIGHBORHOODS } from '@/lib/utils';

export function NeighborhoodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeNeighborhood = searchParams.get('neighborhood') || 'all';
  const activeCategory = searchParams.get('category') || '';
  const [optimisticNeighborhood, setOptimisticNeighborhood] = useOptimistic(activeNeighborhood);
  const [isPending, startTransition] = useTransition();

  const allTabs = [{ label: 'All', value: 'all' }, ...NEIGHBORHOODS.map(n => {return { label: n, value: n }})];

  function handleChange(value: string) {
    startTransition(async () => {
      setOptimisticNeighborhood(value);
      const params = new URLSearchParams();
      if (activeCategory) params.set('category', activeCategory);
      if (value !== 'all') params.set('neighborhood', value);
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : '/');
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        {allTabs.map(tab => {
          const isActive = tab.value === optimisticNeighborhood;
          return (
            <button
              key={tab.value}
              onClick={() => {
                handleChange(tab.value);
              }}
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all',
                isActive
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground',
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
