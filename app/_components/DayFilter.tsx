'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { TabList } from '@/components/design/TabList';
import { DAYS } from '@/lib/utils';

const tabs = [{ label: 'All', value: 'all' }, ...DAYS];

export function DayFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeDay = searchParams.get('day') || 'all';
  const activeTrack = searchParams.get('track') || '';

  async function changeAction(value: string) {
    const params = new URLSearchParams();
    if (value !== 'all') params.set('day', value);
    if (activeTrack) params.set('track', activeTrack);
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  }

  return (
    <TabList
      tabs={tabs}
      activeTab={activeDay}
      changeAction={changeAction}
    />
  );
}
