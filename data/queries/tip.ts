import 'server-only';

import { cache } from 'react';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

export const getTipsBySpot = cache(async (spotSlug: string) => {
  await slow();

  return prisma.tip.findMany({
    orderBy: { createdAt: 'desc' },
    where: { spotSlug },
  });
});

export const getTipCount = cache(async (spotSlug: string) => {
  await slow(300);

  return prisma.tip.count({
    where: { spotSlug },
  });
});
