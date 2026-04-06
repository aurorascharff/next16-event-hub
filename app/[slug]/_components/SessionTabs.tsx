'use client';

import { HelpCircle, Info, MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { BottomNav } from '@/components/design/BottomNav';

export function SessionTabs() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <BottomNav
      tabs={[
        { href: `/${slug}`, icon: <Info className="size-4" />, label: 'Info' },
        { href: `/${slug}/comments`, icon: <MessageCircle className="size-4" />, label: 'Comments' },
        { href: `/${slug}/questions`, icon: <HelpCircle className="size-4" />, label: 'Questions' },
      ]}
    />
  );
}
