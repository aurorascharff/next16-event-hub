'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

type Tab<T extends string> = {
  href: Route<T>;
  icon?: React.ReactNode;
  label: string;
};

type Props<T extends string> = {
  tabs: Tab<T>[];
  action?: (href: string) => void | Promise<void>;
  className?: string;
};

export function BottomNav<T extends string>({ tabs, action, className }: Props<T>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  const activeIndex = tabs.findIndex(tab => {
    return currentUrl === tab.href || pathname === tab.href;
  });
  const resolvedActive = activeIndex >= 0 ? activeIndex : 0;

  const [optimisticActive, setOptimisticActive] = useOptimistic(resolvedActive);
  const [, startTransition] = useTransition();

  return (
    <nav
      className={cn(
        'bg-background/80 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md',
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
              onClick={() => {
                startTransition(async () => {
                  setOptimisticActive(i);
                  if (action) {
                    await action(tab.href);
                  }
                });
              }}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
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
}
