import 'server-only';

import { cache } from 'react';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

export const getQuestionsByEvent = cache(async (eventSlug: string, currentUser?: string | null) => {
  await slow(1500);

  const questions = await prisma.question.findMany({
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

  let votedIds = new Set<string>();
  if (currentUser) {
    const votes = await prisma.questionVote.findMany({
      select: { questionId: true },
      where: {
        questionId: {
          in: questions.map(q => {
            return q.id;
          }),
        },
        userName: currentUser,
      },
    });
    votedIds = new Set(
      votes.map(v => {
        return v.questionId;
      }),
    );
  }

  return questions.map(q => {
    return { ...q, hasVoted: votedIds.has(q.id) };
  });
});
