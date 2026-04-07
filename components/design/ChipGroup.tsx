'use client';

import { addTransitionType, useOptimistic, useTransition } from 'react';
import { cn } from '@/lib/utils';

type ChipItem<V extends string> = {
  label: string;
  value: V;
};

type Props<V extends string> = {
  items: ChipItem<V>[];
  value: V;
  action?: (value: V) => void | Promise<void>;
  onChange?: (value: V) => void;
  variant?: 'pill' | 'toggle';
  className?: string;
};

export function ChipGroup<V extends string>({ items, value, action, onChange, variant = 'pill', className }: Props<V>) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const [isPending, startTransition] = useTransition();

  function handleSelect(itemValue: V) {
    if (action) {
      startTransition(async () => {
        addTransitionType('filter');
        setOptimisticValue(itemValue);
        await action(itemValue);
      });
    } else {
      onChange?.(itemValue);
    }
  }

  if (variant === 'toggle') {
    return (
      <div data-pending={isPending ? '' : undefined} className={cn('bg-muted flex rounded-full p-0.5', className)}>
        {items.map(item => {
          return (
            <button
              key={item.value}
              onClick={() => {
                handleSelect(item.value);
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
    <div
      data-pending={isPending ? '' : undefined}
      className={cn('scrollbar-none flex gap-1.5 overflow-x-auto', className)}
    >
      {items.map(item => {
        return (
          <button
            key={item.value}
            onClick={() => {
              handleSelect(item.value);
            }}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1 text-sm transition-colors',
              optimisticValue === item.value
                ? 'bg-foreground text-background border-foreground font-medium'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
