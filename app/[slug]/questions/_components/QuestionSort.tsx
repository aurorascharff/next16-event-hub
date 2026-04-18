'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChipGroup } from '@/components/design/ChipGroup';
import type { SortValue } from '@/types';

const sortOptions: { label: string; value: SortValue }[] = [
  { label: 'Top', value: 'top' },
  { label: 'Newest', value: 'newest' },
];

export function QuestionSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = (searchParams.get('sort') as SortValue) || 'top';

  function sortAction(value: SortValue) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'top') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '?');
  }

  return <ChipGroup items={sortOptions} value={sort} action={sortAction} variant="toggle" />;
}
