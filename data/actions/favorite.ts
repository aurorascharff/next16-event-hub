'use server';

import { refresh, revalidateTag } from 'next/cache';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

const DEMO_USER_ID = 'demo-user';

export async function toggleFavorite(spotSlug: string, isFavorited: boolean) {
  await slow(400);

  if (isFavorited) {
    await prisma.favorite.delete({
      where: { userId_spotSlug: { spotSlug, userId: DEMO_USER_ID } },
    });
  } else {
    await prisma.favorite.create({
      data: { spotSlug, userId: DEMO_USER_ID },
    });
  }

  revalidateTag(`spot-${spotSlug}`, 'max');
  refresh();
}
