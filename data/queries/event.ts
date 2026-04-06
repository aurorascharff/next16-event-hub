import 'server-only';

import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/db';
import { parseTime, slow } from '@/lib/utils';

export const getEvents = cache(async (day?: string, label?: string) => {
  'use cache';
  cacheTag('events');

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
  const favorites = await prisma.favorite.findMany({
    select: { eventSlug: true },
    where: { userName },
  });
  return new Set(favorites.map(f => {return f.eventSlug}));
});

export const getAdjacentEvents = cache(async (slug: string) => {
  const allEvents = await getEvents();
  const index = allEvents.findIndex(e => {return e.slug === slug});
  return {
    next: index < allEvents.length - 1 ? allEvents[index + 1] : null,
    prev: index > 0 ? allEvents[index - 1] : null,
  };
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
