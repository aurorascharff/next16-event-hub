import 'server-only';

import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/db';

export const getEvents = cache(async (day?: string, label?: string) => {
  // 'use cache';
  // cacheTag('events');

  const where: Record<string, unknown> = {};
  if (day) {
    where.day = day;
  }
  if (label && label !== 'all') {
    where.labels = { contains: label };
  }

  return prisma.event.findMany({
    orderBy: [{ day: 'asc' }, { time: 'asc' }],
    select: {
      day: true,
      description: true,
      labels: true,
      location: true,
      name: true,
      slug: true,
      speaker: true,
      time: true,
    },
    where,
  });
});

export const getEventBySlug = cache(async (slug: string) => {
  // 'use cache';
  // cacheTag(`event-${slug}`);

  const event = await prisma.event.findUnique({
    where: { slug },
  });
  if (!event) {
    notFound();
  }
  return event;
});
