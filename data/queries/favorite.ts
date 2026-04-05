import 'server-only';

import { cache } from 'react';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

export const getUserFavorite = cache(async (spotSlug: string, userId: string) => {
  await slow(300);

  const fav = await prisma.favorite.findUnique({
    where: { userId_spotSlug: { spotSlug, userId } },
  });
  return !!fav;
});

export const getFavoriteCount = cache(async (spotSlug: string) => {
  await slow(300);

  return prisma.favorite.count({
    where: { spotSlug },
  });
});
