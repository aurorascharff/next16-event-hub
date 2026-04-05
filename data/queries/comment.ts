import 'server-only';

import { cache } from 'react';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

export const getCommentsByEvent = cache(async (eventSlug: string) => {
  await slow();

  return prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      content: true,
      createdAt: true,
      eventSlug: true,
      id: true,
      likes: true,
      userName: true,
    },
    where: { eventSlug },
  });
});

export const getCommentCount = cache(async (eventSlug: string) => {
  await slow(300);
  return prisma.comment.count({ where: { eventSlug } });
});

export const getUserLike = cache(async (commentId: string, userName: string) => {
  const like = await prisma.commentLike.findUnique({
    where: { userName_commentId: { commentId, userName } },
  });
  return !!like;
});
