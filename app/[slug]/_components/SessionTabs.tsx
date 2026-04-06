'use client';

import { CalendarDays, HelpCircle, Home } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { BottomNav } from '@/components/design/BottomNav';

type Props = {
  children: React.ReactNode;
};

export function SessionTabs({ children }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  return (
    <BottomNav
      tabs={[
        { href: '/', icon: <Home className="size-4" />, label: 'Home', transitionTypes: ['nav-back'] },
        { href: `/${slug}`, icon: <CalendarDays className="size-4" />, label: 'Session' },
        { href: `/${slug}/questions`, icon: <HelpCircle className="size-4" />, label: 'Questions' },
      ]}
      action={href => router.push(href)}
    >
      {children}
    </BottomNav>
  );
}
