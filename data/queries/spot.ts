import 'server-only';

import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

export const getSpots = cache(async (category?: string, neighborhood?: string) => {
  'use cache';
  cacheTag('spots');

  await slow();

  const where: Record<string, unknown> = {};
  if (category && category !== 'all') {
    where.category = category;
  }
  if (neighborhood && neighborhood !== 'all') {
    where.neighborhood = neighborhood;
  }

  return prisma.spot.findMany({
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    select: {
      category: true,
      description: true,
      featured: true,
      name: true,
      neighborhood: true,
      slug: true,
    },
    where,
  });
});

export const getSpotBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag(`spot-${slug}`);

  await slow();

  const spot = await prisma.spot.findUnique({
    where: { slug },
  });
  if (!spot) {
    notFound();
  }
  return spot;
});

export const getFeaturedSpots = cache(async () => {
  'use cache';
  cacheTag('spots');

  return prisma.spot.findMany({
    orderBy: { name: 'asc' },
    select: {
      category: true,
      description: true,
      name: true,
      neighborhood: true,
      slug: true,
    },
    where: { featured: true },
  });
});
