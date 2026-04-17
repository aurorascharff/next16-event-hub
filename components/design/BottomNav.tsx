'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

type Tab<T extends string> = {
  href: Route<T>;
  icon?: React.ReactNode;
  label: string;
};

type Props<T extends string> = {
  tabs: readonly Tab<T>[];
  activeIndex?: number;
  action?: (href: Route<T>) => void | Promise<void>;
  onChange?: (href: Route<T>) => void;
  className?: string;
};

export function BottomNav<T extends string>({ tabs, activeIndex, action, onChange, className }: Props<T>) {
  const pathname = usePathname();
  const resolvedActive =
    activeIndex ??
    Math.max(
      0,
      tabs.findIndex(tab => {
        return pathname === tab.href;
      }),
    );

  const [optimisticActive, setOptimisticActive] = useOptimistic(resolvedActive);
  const [isPending, startTransition] = useTransition();

  return (
    <nav
      className={cn('fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(0.5rem+env(safe-area-inset-bottom))]', className)}
      style={{ viewTransitionName: 'bottom-nav' }}
      aria-busy={isPending}
    >
      <div className="bg-background rounded-2xl border border-border/50 shadow-md">
        <div className="flex p-1">
          {tabs.map((tab, i) => {
            const isActive = i === (action ? optimisticActive : resolvedActive);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={e => {
                  e.preventDefault();
                  if (action) {
                    startTransition(async () => {
                      setOptimisticActive(i);
                      await action(tab.href);
                    });
                  } else {
                    onChange?.(tab.href);
                  }
                }}
                className={cn(
                  'flex flex-col items-center gap-0.5 whitespace-nowrap rounded-2xl px-7 py-2.5 text-xs font-medium transition-colors',
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground',
                  action && isPending && !isActive && 'opacity-40',
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
