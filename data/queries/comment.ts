import 'server-only';

import { cacheTag } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/db';

export const getCommentsByEvent = cache(async (eventSlug: string, currentUserName?: string | null) => {
  'use cache';
  cacheTag(`comments-${eventSlug}`);

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      commentLikes: currentUserName
        ? {
            select: { id: true },
            where: { userName: currentUserName },
          }
        : false,
      content: true,
      createdAt: true,
      eventSlug: true,
      id: true,
      likes: true,
      userName: true,
    },
    where: { eventSlug },
  });

  return comments.map(({ commentLikes, ...comment }) => {
    return {
      ...comment,
      hasLiked: Array.isArray(commentLikes) && commentLikes.length > 0,
    };
  });
});
