'use client';

import { useRouter } from 'next/navigation';
import { addTransitionType, startTransition } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import type { Route } from 'next';

type Props<T extends string = string> = VariantProps<typeof buttonVariants> & {
  href?: Route<T>;
  action?: () => Promise<void>;
  children?: React.ReactNode;
  className?: string;
};

export function BackButton<T extends string>({
  variant = 'ghost',
  size,
  className,
  href,
  action,
  children = '← Back',
}: Props<T>) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          addTransitionType('nav-back');
          if (action) await action();
          if (href) {
            router.push(href);
          } else {
            router.back();
          }
        });
      }}
      className={cn(
        buttonVariants({ size, variant }),
        'text-muted-foreground hover:text-foreground cursor-pointer',
        className,
      )}
    >
      {children}
    </button>
  );
}
