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
      <header
        className="bg-background/90 sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ viewTransitionName: 'header' }}
      >
        <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6">
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

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <ViewTransition name={`spot-${slug}`}>
          <article>
            <div className="mb-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
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
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{spot.name}</h1>
              <p className="text-muted-foreground leading-relaxed">{spot.description}</p>
            </div>
            <div className="text-foreground/90 text-sm leading-relaxed whitespace-pre-line sm:text-base">
              {spot.content}
            </div>
          </article>
        </ViewTransition>

        <div className="mt-10 border-t pt-6">
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
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <MessageCircle className="text-primary size-4" />
        <h2 className="text-sm font-semibold">Tips from visitors</h2>
        <span className="text-muted-foreground text-xs">({tips.length})</span>
      </div>
      <TipList tips={tips} spotSlug={slug} />
      <div className="border-t pt-5">
        <TipForm spotSlug={slug} />
      </div>
    </div>
  );
}

function TipsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => {
          return (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-full" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
