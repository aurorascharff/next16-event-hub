'use client';

import { ArrowLeft, CalendarDays, HelpCircle } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { addTransitionType } from 'react';
import { BottomNav } from '@/components/design/BottomNav';
import type { Route } from 'next';

export default function SessionTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { slug } = useParams<{ slug: string }>();

  const activeIndex = pathname.endsWith('/questions') ? 2 : 1;

  const tabs = [
    { href: '/' as Route, icon: <ArrowLeft className="size-5" />, label: 'Back' },
    { href: `/${slug}` as Route, icon: <CalendarDays className="size-5" />, label: 'Session' },
    { href: `/${slug}/questions` as Route, icon: <HelpCircle className="size-5" />, label: 'Questions' },
  ];

  return (
    <BottomNav
      tabs={tabs}
      activeIndex={activeIndex}
      action={href => {
        addTransitionType('tab-switch');
        if (href === '/') {
          addTransitionType('nav-back');
        }
        router.push(href);
      }}
    />
  );
}
