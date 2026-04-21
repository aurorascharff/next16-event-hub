'use server';

import { refresh } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/data/queries/auth';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

const commentSchema = z.object({
  content: z.string().trim().min(1, 'Comment is required').max(500),
});

export type CommentActionResult = { success: true } | { error: string; success: false };

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

  refresh();
  return { success: true };
}

export async function deleteComment(commentId: string, eventSlug: string) {
  const [userName, comment] = await Promise.all([
    getCurrentUser(),
    prisma.comment.findUnique({ where: { id: commentId } }),
  ]);
  if (!userName) return;
  if (!comment || comment.userName !== userName) return;

  await slow();
  await prisma.comment.delete({
    where: { id: commentId },
  });

  refresh();
}
