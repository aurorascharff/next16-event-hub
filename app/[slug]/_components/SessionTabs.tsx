'use client';

import { ArrowLeft, CalendarDays, HelpCircle } from 'lucide-react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { addTransitionType } from 'react';
import { BottomNav } from '@/components/design/BottomNav';
import type { Route } from 'next';

export default function SessionTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { slug } = useParams<{ slug: string }>();

  const qs = searchParams.toString();
  const suffix = qs ? `?${qs}` : '';
  const activeIndex = pathname.endsWith('/questions') ? 2 : 1;

  const tabs = [
    { href: `/${suffix}` as Route, icon: <ArrowLeft className="size-5" />, label: 'Back' },
    { href: `/${slug}${suffix}` as Route, icon: <CalendarDays className="size-5" />, label: 'Session' },
    { href: `/${slug}/questions${suffix}` as Route, icon: <HelpCircle className="size-5" />, label: 'Questions' },
  ];

  return (
    <BottomNav
      tabs={tabs}
      activeIndex={activeIndex}
      action={href => {
        if (href.startsWith('/?') || href === '/') {
          addTransitionType('nav-back');
        }
        router.push(href);
      }}
    />
  );
}
