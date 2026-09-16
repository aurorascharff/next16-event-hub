'use server';

import { refresh } from 'next/cache';
import { prisma } from '@/db';
import { getCurrentUser } from '@/features/user/user-queries';

export async function toggleFavorite(eventSlug: string): Promise<string | undefined> {
  const userName = await getCurrentUser();
  if (!userName) return 'Sign in to favorite sessions.';

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
    return 'Could not update favorite. Try again.';
  }

  refresh();
}
