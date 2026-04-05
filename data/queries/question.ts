import 'server-only';

import { cache } from 'react';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

export const getQuestionsByEvent = cache(async (eventSlug: string) => {
  await slow();

  return prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      content: true,
      createdAt: true,
      eventSlug: true,
      id: true,
      userName: true,
      votes: true,
    },
    where: { eventSlug },
  });
});

export const getQuestionCount = cache(async (eventSlug: string) => {
  await slow(300);
  return prisma.question.count({ where: { eventSlug } });
});

export const getUserVote = cache(async (questionId: string, userName: string) => {
  const vote = await prisma.questionVote.findUnique({
    where: { userName_questionId: { questionId, userName } },
  });
  return !!vote;
});
