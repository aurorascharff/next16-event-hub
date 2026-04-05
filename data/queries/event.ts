import 'server-only';

import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/db';

export const getEvents = cache(async (day?: string, track?: string) => {
  'use cache';
  cacheTag('events');

  const where: Record<string, unknown> = {};
  if (day && day !== 'all') {
    where.day = day;
  }
  if (track && track !== 'all') {
    where.track = track;
  }

  return prisma.event.findMany({
    orderBy: [{ day: 'asc' }, { time: 'asc' }],
    select: {
      day: true,
      description: true,
      location: true,
      name: true,
      slug: true,
      speaker: true,
      time: true,
      track: true,
    },
    where,
  });
});

export const getEventBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag(`event-${slug}`);

  const event = await prisma.event.findUnique({
    where: { slug },
  });
  if (!event) {
    notFound();
  }
  return event;
});
