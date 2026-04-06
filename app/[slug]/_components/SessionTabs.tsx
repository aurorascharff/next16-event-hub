'use client';

import { ArrowLeft, CalendarDays, HelpCircle } from 'lucide-react';
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
        { href: '/', icon: <ArrowLeft className="size-4" />, label: 'Back', transitionTypes: ['nav-back'] },
        { href: `/${slug}`, icon: <CalendarDays className="size-4" />, label: 'Session' },
        { href: `/${slug}/questions`, icon: <HelpCircle className="size-4" />, label: 'Questions' },
      ]}
      action={href => router.push(href)}
    >
      {children}
    </BottomNav>
  );
}
