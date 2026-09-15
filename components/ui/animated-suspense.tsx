import { Suspense, ViewTransition } from 'react';

type AnimatedSuspenseProps = {
  animation?: 'crossfade' | 'slide';
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function AnimatedSuspense({ animation = 'crossfade', children, fallback }: AnimatedSuspenseProps) {
  const isSliding = animation === 'slide';

  return (
    <Suspense
      fallback={
        <ViewTransition default="none" exit={isSliding ? 'slide-down' : 'auto'}>
          {fallback}
        </ViewTransition>
      }
    >
      <ViewTransition enter={isSliding ? 'slide-up' : 'auto'} default="none">
        {children}
      </ViewTransition>
    </Suspense>
  );
}
