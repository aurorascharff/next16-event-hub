'use client';

import { addTransitionType, useOptimistic, useTransition } from 'react';
import { cn } from '@/lib/utils';

type ToggleItem<V extends string> = {
  label: string;
  value: V;
};

type Props<V extends string> = {
  items: ToggleItem<V>[];
  value: V;
  action?: (value: V) => void | Promise<void>;
  onChange?: (value: V) => void;
  variant?: 'pill' | 'toggle';
  className?: string;
};

export function ToggleGroup<V extends string>({
  items,
  value,
  action,
  onChange,
  variant = 'pill',
  className,
}: Props<V>) {
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
      <div className={cn('bg-muted flex rounded-lg p-1', className)}>
        {items.map(item => {
          return (
            <button
              key={item.value}
              onClick={() => {
                handleSelect(item.value);
              }}
              className={cn(
                isPending && item.value === optimisticValue && 'animate-pulse',
                'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
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
    <div className={cn('scrollbar-none flex gap-1.5 overflow-x-auto', className)}>
      {items.map(item => {
        return (
          <button
            key={item.value}
            onClick={() => {
              handleSelect(item.value);
            }}
            className={cn(
              isPending && item.value === optimisticValue && 'animate-pulse',
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
