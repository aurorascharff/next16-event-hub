'use client';

import { Calendar, Heart } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BottomNav } from '@/components/design/BottomNav';

const homeTabs = [
  {
    href: '/?day=day-1',
    icon: <Calendar className="size-5" />,
    label: 'Day 1',
  },
  {
    href: '/?day=day-2',
    icon: <Calendar className="size-5" />,
    label: 'Day 2',
  },
  {
    href: '/?label=favorites',
    icon: <Heart className="size-5" />,
    label: 'Favorites',
  },
] as const;

export default function HomeTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const label = searchParams.get('label');
  const day = searchParams.get('day') || 'day-1';
  const activeIndex = label === 'favorites' ? 2 : day === 'day-2' ? 1 : 0;

  return (
    <BottomNav
      tabs={homeTabs}
      activeIndex={activeIndex}
      onChange={href => {
        return router.push(href);
      }}
    />
  );
}
