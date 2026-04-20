import { ViewTransition } from 'react';

export function NavForward({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ default: 'none', 'nav-forward': 'slide-from-right', 'tab-switch': 'auto' }}
      exit={{ default: 'none', 'nav-back': 'slide-to-right', 'tab-switch': 'auto' }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

export function NavBack({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ default: 'none', 'nav-back': 'slide-from-left', 'tab-switch': 'auto' }}
      exit={{ default: 'none', 'nav-forward': 'slide-to-left', 'tab-switch': 'auto' }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
