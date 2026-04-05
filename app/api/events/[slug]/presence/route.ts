import { NextResponse } from 'next/server';
import { prisma } from '@/db';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const cutoff = new Date(Date.now() - 30_000);
  const activeUsers = await prisma.presence.findMany({
    orderBy: { lastSeen: 'desc' },
    select: {
      lastSeen: true,
      userName: true,
    },
    where: {
      eventSlug: slug,
      lastSeen: { gte: cutoff },
    },
  });

  return NextResponse.json(activeUsers);
}
