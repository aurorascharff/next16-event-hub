import 'server-only';

import { cacheTag } from 'next/cache';
import { notFound, unauthorized } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';
import { canManageSpots } from './auth';

export type SpotFilter = 'all' | 'published' | 'drafts' | 'featured' | 'archived';
export type SpotSort = 'newest' | 'oldest' | 'name';

export const getSpots = cache(async (filter?: SpotFilter, sort?: SpotSort, category?: string) => {
  if (!canManageSpots()) {
    unauthorized();
  }

  await slow();

  const where: Record<string, unknown> = {};

  if (filter === 'archived') {
    where.archived = true;
  } else if (filter === 'published') {
    where.archived = false;
    where.published = true;
  } else if (filter === 'drafts') {
    where.archived = false;
    where.published = false;
  } else if (filter === 'featured') {
    where.archived = false;
    where.featured = true;
  } else {
    where.archived = false;
  }

  if (category && category !== 'all') {
    where.category = category;
  }

  const orderBy =
    sort === 'oldest'
      ? { createdAt: 'asc' as const }
      : sort === 'name'
        ? { name: 'asc' as const }
        : { createdAt: 'desc' as const };

  return await prisma.spot.findMany({
    orderBy,
    where,
  });
});

export const getSpotBySlug = cache(async (slug: string) => {
  if (!canManageSpots()) {
    unauthorized();
  }

  await slow();
  const spot = await prisma.spot.findUnique({
    where: { slug },
  });
  if (!spot) {
    notFound();
  }
  return spot;
});

export const getPublishedSpots = cache(async (category?: string) => {
  'use cache';
  cacheTag('spots');

  await slow();

  const where: Record<string, unknown> = { archived: false, published: true };
  if (category && category !== 'all') {
    where.category = category;
  }

  return prisma.spot.findMany({
    orderBy: { createdAt: 'desc' },
    where,
  });
});

export const getPublishedSpotBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag(`spot-${slug}`);

  await slow();
  const spot = await prisma.spot.findUnique({
    where: { archived: false, published: true, slug },
  });
  if (!spot) {
    notFound();
  }
  return spot;
});

export const getNeighborhoods = cache(async () => {
  'use cache';
  cacheTag('spots');

  const spots = await prisma.spot.findMany({
    distinct: ['neighborhood'],
    select: { neighborhood: true },
    where: { archived: false, published: true },
  });
  return spots.map(s => {return s.neighborhood}).sort();
});

export const getCategories = cache(async () => {
  'use cache';
  cacheTag('spots');

  const spots = await prisma.spot.findMany({
    distinct: ['category'],
    select: { category: true },
    where: { archived: false, published: true },
  });
  return spots.map(s => {return s.category}).sort();
});
