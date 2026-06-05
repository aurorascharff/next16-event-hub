import { cn } from '@/lib/utils';

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={cn(
        'min-h-[calc(100dvh-env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]',
        className,
      )}
    >
      {children}
    </div>
  );
}

type PageContainerProps = {
  children: React.ReactNode;
  size?: 'narrow' | 'wide';
  className?: string;
};

export function PageContainer({ children, size = 'narrow', className }: PageContainerProps) {
  return (
    <div
      className={cn('mx-auto px-4 sm:px-6', size === 'wide' ? 'max-w-4xl py-6' : 'max-w-2xl py-4 sm:py-8', className)}
    >
      {children}
    </div>
  );
}
