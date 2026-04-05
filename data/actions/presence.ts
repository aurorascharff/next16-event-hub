'use server';

import { getCurrentUser } from '@/data/queries/auth';
import { prisma } from '@/db';

export async function recordPresence(eventSlug: string) {
  const userName = await getCurrentUser();
  if (!userName) return;

  await prisma.presence.upsert({
    create: { eventSlug, lastSeen: new Date(), userName },
    update: { eventSlug, lastSeen: new Date() },
    where: { userName },
  });
}
