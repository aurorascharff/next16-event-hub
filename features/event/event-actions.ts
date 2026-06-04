'use server';

import { refresh } from 'next/cache';
import { prisma } from '@/db';
import { getCurrentUser } from '@/features/user/user-queries';

export async function toggleFavorite(eventSlug: string) {
  const userName = await getCurrentUser();
  if (!userName) return;

  const existing = await prisma.favorite.findUnique({
    where: { userName_eventSlug: { eventSlug, userName } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { eventSlug, userName } });
  }

  refresh();
}
