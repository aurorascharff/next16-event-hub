import 'server-only';

import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/db';
import { parseTime, slow } from '@/lib/utils';

export const getEvents = cache(async (day?: string, label?: string) => {
  await slow();
  const where: Record<string, unknown> = {};
  if (day) {
    where.day = day;
  }
  if (label && label !== 'all' && label !== 'favorites') {
    where.labels = { contains: label };
  }

  const events = await prisma.event.findMany({
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

  return events.sort((a, b) => {
    if (a.day !== b.day) return a.day.localeCompare(b.day);
    return parseTime(a.time) - parseTime(b.time);
  });
});

export const getUserFavorites = cache(async (userName: string) => {
  await slow(500);
  const favorites = await prisma.favorite.findMany({
    select: { eventSlug: true },
    where: { userName },
  });
  return new Set(
    favorites.map(f => {
      return f.eventSlug;
    }),
  );
});

export const getEventBySlug = cache(async (slug: string) => {
  await slow();
  const event = await prisma.event.findUnique({
    where: { slug },
  });
  if (!event) {
    notFound();
  }
  return event;
});
