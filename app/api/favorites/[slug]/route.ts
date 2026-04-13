import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/data/queries/auth';
import { getUserFavorites } from '@/data/queries/event';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ hasFavorited: false });
  }
  const favorites = await getUserFavorites(currentUser);
  return NextResponse.json({ hasFavorited: favorites.has(slug) });
}
