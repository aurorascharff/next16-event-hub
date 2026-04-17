'use client';

import { ArrowLeft, CalendarDays, HelpCircle } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { BottomNav } from '@/components/design/BottomNav';
import type { Route } from 'next';

export default function SessionTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = useParams<{ slug: string }>();

  const qs = searchParams.toString();
  const suffix = qs ? `?${qs}` : '';

  const tabs = [
    { href: `/${suffix}` as Route, icon: <ArrowLeft className="size-5" />, label: 'Back' },
    { href: `/${slug}${suffix}` as Route, icon: <CalendarDays className="size-5" />, label: 'Session' },
    { href: `/${slug}/questions${suffix}` as Route, icon: <HelpCircle className="size-5" />, label: 'Questions' },
  ];

  return (
    <BottomNav
      tabs={tabs}
      onChange={href => {
        router.push(href);
      }}
    />
  );
}
