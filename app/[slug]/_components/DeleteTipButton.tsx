'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteTip } from '@/data/actions/tip';
import { cn } from '@/lib/utils';

type Props = {
  tipId: string;
  spotSlug: string;
};

export function DeleteTipButton({ tipId, spotSlug }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteTip(tipId, spotSlug);
    });
  }

  return (
    <button
      onClick={handleDelete}
      data-pending={isPending || undefined}
      className={cn(
        'text-muted-foreground hover:text-destructive rounded p-1 opacity-0 transition-all group-hover:opacity-100',
        'data-[pending]:opacity-100 data-[pending]:animate-pulse',
      )}
      aria-label="Delete tip"
    >
      <Trash2 className="size-3.5" />
    </button>
  );
}
