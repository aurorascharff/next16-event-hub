'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { addTransitionType, useOptimistic, useTransition } from 'react';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

type Tab<T extends string> = {
  href: Route<T>;
  icon?: React.ReactNode;
  label: string;
  transitionType?: string;
};

type Props<T extends string> = {
  tabs: Tab<T>[];
  activeIndex?: number;
  action: (href: string) => void | Promise<void>;
  className?: string;
  children?: React.ReactNode;
};

export function BottomNav<T extends string>({ tabs, activeIndex, action, className, children }: Props<T>) {
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

  const nav = (
    <nav
      className={cn(
        'bg-background fixed inset-x-0 bottom-0 z-40 border-t',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
      style={{ viewTransitionName: 'bottom-nav' }}
    >
      <div className="mx-auto flex max-w-4xl">
        {tabs.map((tab, i) => {
          const isActive = i === optimisticActive;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={e => {
                e.preventDefault();
                startTransition(async () => {
                  if (tab.transitionType) {
                    addTransitionType(tab.transitionType);
                  }
                  setOptimisticActive(i);
                  await action(tab.href);
                });
              }}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );

  if (children) {
    return (
      <>
        <div className={isPending ? 'animate-pulse' : undefined}>{children}</div>
        {nav}
      </>
    );
  }

  return nav;
}

export function BottomNavSkeleton({ count }: { count: number }) {
  return (
    <nav
      className="bg-background fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)]"
      style={{ viewTransitionName: 'bottom-nav' }}
    >
      <div className="mx-auto flex max-w-4xl">
        {Array.from({ length: count }).map((_, i) => {
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-0.5 py-2.5">
              <div className="size-4" />
              <span className="text-xs opacity-0">Tab</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
