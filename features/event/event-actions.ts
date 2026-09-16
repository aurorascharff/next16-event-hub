'use server';

import { refresh } from 'next/cache';
import { prisma } from '@/db';
import { getCurrentUser } from '@/features/user/user-queries';

export async function toggleFavorite(eventSlug: string) {
  const userName = await getCurrentUser();

  if (!userName) {
    return { error: 'Sign in to favorite sessions.', success: false };
  }

  try {
    const existing = await prisma.favorite.findUnique({
      where: { userName_eventSlug: { eventSlug, userName } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
    } else {
      await prisma.favorite.create({ data: { eventSlug, userName } });
    }
  } catch {
    return { error: 'Failed to update favorite status. Please try again later.', success: false };
  }

  refresh();
  return { success: true };
}
