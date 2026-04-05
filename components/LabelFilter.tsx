'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChipGroup } from '@/components/design/ChipGroup';
import { LABELS } from '@/lib/utils';

const labelItems = [
  { label: 'All', value: 'all' },
  ...LABELS.map(l => {
    return { label: l.charAt(0).toUpperCase() + l.slice(1), value: l };
  }),
];

export function LabelFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLabel = searchParams.get('label') || 'all';
  const activeDay = searchParams.get('day') || 'day-1';

  function handleChange(value: string) {
    const params = new URLSearchParams();
    if (activeDay) params.set('day', activeDay);
    if (value !== 'all') params.set('label', value);
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  }

  return <ChipGroup items={labelItems} value={activeLabel} onChange={handleChange} />;
}
