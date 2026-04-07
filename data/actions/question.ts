'use server';

import { updateTag } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/data/queries/auth';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

const questionSchema = z.object({
  content: z.string().min(1, 'Question is required').max(500),
});

export type QuestionActionResult = { success: true } | { error: string; success: false };

export async function addQuestion(eventSlug: string, formData: FormData): Promise<QuestionActionResult> {
  const userName = await getCurrentUser();
  if (!userName) {
    return { error: 'You must be logged in', success: false };
  }

  const result = questionSchema.safeParse({
    content: (formData.get('content') as string) || '',
  });
  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
  }

  await slow();
  const clientId = (formData.get('id') as string) || undefined;
  await prisma.question.create({
    data: {
      content: result.data.content,
      eventSlug,
      userName,
      ...(clientId && { id: clientId }),
    },
  });

  updateTag(`questions-${eventSlug}`);
  return { success: true };
}

export async function upvoteQuestion(questionId: string, eventSlug: string) {
  const userName = await getCurrentUser();
  if (!userName) return;

  await slow(300);

  const existing = await prisma.questionVote.findUnique({
    where: { userName_questionId: { questionId, userName } },
  });

  if (existing) return;

  await prisma.questionVote.create({ data: { questionId, userName } });
  await prisma.question.update({
    data: { votes: { increment: 1 } },
    where: { id: questionId },
  });

  updateTag(`questions-${eventSlug}`);
}
