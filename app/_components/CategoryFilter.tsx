'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn, CATEGORIES } from '@/lib/utils';

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const activeNeighborhood = searchParams.get('neighborhood') || '';
  const [optimisticCategory, setOptimisticCategory] = useOptimistic(activeCategory);
  const [isPending, startTransition] = useTransition();

  const allTabs = [{ label: 'All', value: 'all' }, ...CATEGORIES];

  function handleChange(value: string) {
    startTransition(async () => {
      setOptimisticCategory(value);
      const params = new URLSearchParams();
      if (value !== 'all') params.set('category', value);
      if (activeNeighborhood) params.set('neighborhood', activeNeighborhood);
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : '/');
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        {allTabs.map(tab => {
          const isActive = tab.value === optimisticCategory;
          return (
            <button
              key={tab.value}
              onClick={() => {
                handleChange(tab.value);
              }}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
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
