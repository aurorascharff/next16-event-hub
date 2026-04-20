import { ViewTransition } from 'react';

export function NavForward({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ default: 'none', 'nav-forward': 'nav-forward', 'tab-switch': 'auto' }}
      exit={{ default: 'none', 'nav-back': 'nav-back', 'tab-switch': 'auto' }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

export function NavBack({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ default: 'none', 'nav-back': 'nav-back', 'tab-switch': 'auto' }}
      exit={{ default: 'none', 'nav-forward': 'nav-forward', 'tab-switch': 'auto' }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
