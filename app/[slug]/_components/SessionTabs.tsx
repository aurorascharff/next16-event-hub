'use client';

import { ArrowLeft, CalendarDays, HelpCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { addTransitionType } from 'react';
import { BottomNav } from '@/components/design/BottomNav';
import type { Route } from 'next';

export default function SessionTabs() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const tabs = [
    { href: '/' as Route, icon: <ArrowLeft className="size-5" />, label: 'Back' },
    { href: `/${slug}` as Route, icon: <CalendarDays className="size-5" />, label: 'Session' },
    { href: `/${slug}/questions` as Route, icon: <HelpCircle className="size-5" />, label: 'Questions' },
  ];

  return (
    <BottomNav
      tabs={tabs}
      action={href => {
        if (href === '/') {
          addTransitionType('nav-back');
          router.back();
        } else {
          router.push(href);
        }
      }}
    />
  );
}
