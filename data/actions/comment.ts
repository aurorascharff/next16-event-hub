'use server';

import { refresh, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/data/queries/auth';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(500),
});

export type CommentActionResult =
  | { success: true }
  | { error: string; success: false };

export async function addComment(eventSlug: string, formData: FormData): Promise<CommentActionResult> {
  const userName = await getCurrentUser();
  if (!userName) {
    return { error: 'You must be logged in', success: false };
  }

  const result = commentSchema.safeParse({
    content: (formData.get('content') as string) || '',
  });
  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
  }

  await slow();
  await prisma.comment.create({
    data: {
      content: result.data.content,
      eventSlug,
      userName,
    },
  });

  revalidateTag(`event-${eventSlug}`, 'max');
  refresh();
  return { success: true };
}

export async function deleteComment(commentId: string, eventSlug: string) {
  await slow(400);
  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidateTag(`event-${eventSlug}`, 'max');
  refresh();
}

export async function toggleLike(commentId: string, eventSlug: string) {
  const userName = await getCurrentUser();
  if (!userName) return;

  await slow(300);

  const existing = await prisma.commentLike.findUnique({
    where: { userName_commentId: { commentId, userName } },
  });

  if (existing) {
    await prisma.commentLike.delete({ where: { id: existing.id } });
    await prisma.comment.update({
      data: { likes: { decrement: 1 } },
      where: { id: commentId },
    });
  } else {
    await prisma.commentLike.create({ data: { commentId, userName } });
    await prisma.comment.update({
      data: { likes: { increment: 1 } },
      where: { id: commentId },
    });
  }

  revalidateTag(`event-${eventSlug}`, 'max');
  refresh();
}
