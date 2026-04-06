'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { addTransitionType, useOptimistic, useTransition, ViewTransition } from 'react';
import { cn } from '@/lib/utils';

type Tab<T extends string> = {
  href: Route<T>;
  icon?: React.ReactNode;
  label: string;
  transitionTypes?: readonly string[];
};

type Props<T extends string> = {
  tabs: readonly Tab<T>[];
  activeIndex?: number;
  action: (href: Route<T>) => void | Promise<void>;
  onChange?: (href: Route<T>) => void;
  className?: string;
  children?: React.ReactNode;
};

export function BottomNav<T extends string>({ tabs, activeIndex, action, onChange, className, children }: Props<T>) {
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
  const [, startTransition] = useTransition();

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
                onChange?.(tab.href);
                startTransition(async () => {
                  addTransitionType('tab-switch');
                  tab.transitionTypes?.forEach(t => addTransitionType(t));
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
        <ViewTransition update={{ 'tab-switch': 'auto', default: 'none' }} default="none">
          <div>{children}</div>
        </ViewTransition>
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
