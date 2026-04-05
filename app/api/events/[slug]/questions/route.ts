import { NextResponse } from 'next/server';
import { prisma } from '@/db';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      content: true,
      createdAt: true,
      eventSlug: true,
      id: true,
      userName: true,
      votes: true,
    },
    where: { eventSlug: slug },
  });

  return NextResponse.json(questions);
}
