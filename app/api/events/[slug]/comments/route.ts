import { NextResponse } from 'next/server';
import { prisma } from '@/db';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      content: true,
      createdAt: true,
      eventSlug: true,
      id: true,
      likes: true,
      userName: true,
    },
    where: { eventSlug: slug },
  });

  return NextResponse.json(comments);
}
