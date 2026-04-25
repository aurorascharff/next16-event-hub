'use server';

import { refresh } from 'next/dist/server/web/spec-extension/revalidate';
import { getCurrentUser } from '@/data/queries/auth';
import { prisma } from '@/db';

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
