'use client';

import { useOptimistic, useTransition } from 'react';
import { cn } from '@/lib/utils';

type ChipItem<V extends string> = {
  label: string;
  value: V;
};

type Props<V extends string> = {
  items: ChipItem<V>[];
  value: V;
  action: (value: V) => void;
  variant?: 'pill' | 'toggle';
  className?: string;
};

export function ChipGroup<V extends string>({ items, value, action, variant = 'pill', className }: Props<V>) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const [, startTransition] = useTransition();

  function handleClick(itemValue: V) {
    startTransition(() => {
      setOptimisticValue(itemValue);
      action(itemValue);
    });
  }

  if (variant === 'toggle') {
    return (
      <div className={cn('bg-muted flex rounded-full p-0.5', className)}>
        {items.map(item => {
          return (
            <button
              key={item.value}
              onClick={() => {
                handleClick(item.value);
              }}
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium transition-all',
                optimisticValue === item.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map(item => {
        return (
          <button
            key={item.value}
            onClick={() => {
              handleClick(item.value);
            }}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs transition-colors',
              optimisticValue === item.value
                ? 'bg-foreground text-background font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
