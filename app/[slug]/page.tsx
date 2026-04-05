import { MapPin, MessageCircle } from 'lucide-react';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { BackButton } from '@/components/BackButton';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUserId } from '@/data/queries/auth';
import { getFavoriteCount, getUserFavorite } from '@/data/queries/favorite';
import { getSpotBySlug, getSpots } from '@/data/queries/spot';
import { getTipsBySpot } from '@/data/queries/tip';
import { cn, getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { FavoriteButton } from './_components/FavoriteButton';
import { TipForm } from './_components/TipForm';
import { TipList } from './_components/TipList';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const spots = await getSpots();
  return spots.map(spot => {
    return { slug: spot.slug };
  });
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const spot = await getSpotBySlug(slug);

  return {
    description: spot.description,
    title: `${spot.name} | Miami Spots`,
  };
}

export default async function SpotPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  const spot = await getSpotBySlug(slug);

  return (
    <div className="min-h-screen">
      <header className="bg-background/80 sticky top-0 z-30 border-b backdrop-blur-sm" style={{ viewTransitionName: 'header' }}>
        <div className="container mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between">
            <BackButton href="/" size="sm">
              ← All spots
            </BackButton>
            <Suspense fallback={<Skeleton className="h-9 w-20 rounded-full" />}>
              <FavoriteLoader slug={slug} />
            </Suspense>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <ViewTransition name={`spot-${slug}`}>
          <article>
            <div className="mb-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                    getCategoryColor(spot.category),
                  )}
                >
                  {getCategoryLabel(spot.category)}
                </span>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <MapPin className="size-3" />
                  {spot.neighborhood}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{spot.name}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{spot.description}</p>
            </div>
            <div className="prose-sm text-foreground leading-relaxed whitespace-pre-line">
              {spot.content}
            </div>
          </article>
        </ViewTransition>

        <div className="mt-12 border-t pt-8">
          <ViewTransition enter="slide-up" exit="slide-down">
            <Suspense fallback={<TipsSkeleton />}>
              <TipsSection slug={slug} />
            </Suspense>
          </ViewTransition>
        </div>
      </div>
    </div>
  );
}

async function FavoriteLoader({ slug }: { slug: string }) {
  const userId = getCurrentUserId();
  const [isFavorited, count] = await Promise.all([
    getUserFavorite(slug, userId),
    getFavoriteCount(slug),
  ]);
  return <FavoriteButton spotSlug={slug} isFavorited={isFavorited} favoriteCount={count} />;
}

async function TipsSection({ slug }: { slug: string }) {
  const tips = await getTipsBySpot(slug);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="text-muted-foreground size-5" />
        <h2 className="text-lg font-semibold">Tips from visitors</h2>
        <span className="text-muted-foreground text-sm">({tips.length})</span>
      </div>
      <TipList tips={tips} spotSlug={slug} />
      <div className="border-t pt-6">
        <TipForm spotSlug={slug} />
      </div>
    </div>
  );
}

function TipsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="size-5 rounded-full" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => {
          return (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
