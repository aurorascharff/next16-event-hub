'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteComment } from '@/data/actions/comment';

type Props = {
  commentId: string;
  eventSlug: string;
};

export function DeleteButton({ commentId, eventSlug }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => deleteComment(commentId, eventSlug)}
      className="text-muted-foreground hover:text-destructive size-auto rounded p-1 sm:opacity-0 sm:group-hover:opacity-100"
      aria-label="Delete comment"
    >
      <Trash2 className="size-3" />
    </Button>
  );
}
