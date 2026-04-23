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

  function handleClick(e: React.MouseEvent, href: Route<T>, index: number) {
    e.preventDefault();
    if (action) {
      startTransition(async () => {
        setOptimisticActive(index);
        await action(href);
      });
    } else {
      onChange?.(href);
    }
  }

  return (
    <nav
      className={cn(
        'bg-background fixed inset-x-0 bottom-0 z-40 border-t',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
      style={{ viewTransitionName: 'bottom-nav' }}
      aria-busy={isPending}
    >
      <div className="mx-auto flex max-w-4xl gap-1 px-2 py-1.5">
        {tabs.map((tab, i) => {
          const isActive = i === (action ? optimisticActive : resolvedActive);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={e => {
                handleClick(e, tab.href, i);
              }}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-xs font-medium transition-[color,opacity,background-color]',
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
    </nav>
  );
}
