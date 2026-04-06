import 'server-only';

import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/db';
import { parseTime } from '@/lib/utils';
import { cacheTag } from 'next/cache';

export const getEvents = cache(async (day?: string, label?: string, currentUserName?: string | null) => {
  'use cache';
  cacheTag('events');

  const where: Record<string, unknown> = {};
  if (day) {
    where.day = day;
  }
  if (label === 'favorites' && currentUserName) {
    where.favorites = { some: { userName: currentUserName } };
  } else if (label && label !== 'all') {
    where.labels = { contains: label };
  }

  const events = await prisma.event.findMany({
    select: {
      day: true,
      description: true,
      favorites: currentUserName
        ? {
            select: { id: true },
            where: { userName: currentUserName },
          }
        : false,
      labels: true,
      location: true,
      name: true,
      slug: true,
      speaker: true,
      time: true,
    },
    where,
  });

  return events
    .map(({ favorites, ...event }) => {
      return {
        ...event,
        hasFavorited: Array.isArray(favorites) && favorites.length > 0,
      };
    })
    .sort((a, b) => {
      if (a.day !== b.day) return a.day.localeCompare(b.day);
      return parseTime(a.time) - parseTime(b.time);
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
