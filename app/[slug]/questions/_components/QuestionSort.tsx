'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ToggleGroup } from '@/components/design/ToggleGroup';
import type { SortValue } from '@/types';

const sortOptions: { label: string; value: SortValue }[] = [
  { label: 'Top', value: 'top' },
  { label: 'Newest', value: 'newest' },
];

export function QuestionSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = (searchParams.get('sort') as SortValue) || 'newest';

  function sortAction(value: SortValue) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '?');
  }

  return <ToggleGroup items={sortOptions} value={sort} action={sortAction} variant="toggle" />;
}
