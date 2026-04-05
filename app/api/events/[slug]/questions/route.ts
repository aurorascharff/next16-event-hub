import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/db';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const userName = cookieStore.get('event-hub-user')?.value ?? null;

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

  let votedIds = new Set<string>();
  if (userName) {
    const votes = await prisma.questionVote.findMany({
      select: { questionId: true },
      where: { questionId: { in: questions.map(q => { return q.id; }) }, userName },
    });
    votedIds = new Set(votes.map(v => { return v.questionId; }));
  }

  return NextResponse.json(questions.map(q => {
    return { ...q, hasVoted: votedIds.has(q.id) };
  }));
}
