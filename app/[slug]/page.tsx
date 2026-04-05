import { Calendar, Clock, MapPin, Star } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { MarkdownContent } from '@/components/Markdown';
import { SlideRightTransition } from '@/components/ui/animations';
import { Separator } from '@/components/ui/separator';
import { getPublishedSpotBySlug, getPublishedSpots } from '@/data/queries/spot';
import { cn, formatDate, getCategoryColor, getCategoryLabel } from '@/lib/utils';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const spots = await getPublishedSpots();
  return spots.map(spot => {
    return { slug: spot.slug };
  });
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const spot = await getPublishedSpotBySlug(slug);

  return {
    description: spot.description || undefined,
    title: `${spot.name} | Miami Spots`,
  };
}

export default async function SpotPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  const spot = await getPublishedSpotBySlug(slug);

  const wasUpdated = spot.updatedAt > spot.createdAt;

  return (
    <SlideRightTransition>
      <div className="min-h-screen">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <BackButton href="/" size="sm" className="mb-8">
            ← Back to spots
          </BackButton>
          <article>
            <div className="mb-6 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                    getCategoryColor(spot.category),
                  )}
                >
                  {getCategoryLabel(spot.category)}
                </span>
                {spot.featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <Star className="size-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{spot.name}</h1>
              {spot.description && (
                <p className="text-muted-foreground text-lg">{spot.description}</p>
              )}
            </div>
            <MarkdownContent>{spot.content}</MarkdownContent>
            <Separator className="mt-12 mb-6" />
            <footer className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {spot.neighborhood}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(spot.createdAt)}
              </span>
              {wasUpdated && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Updated {formatDate(spot.updatedAt)}
                </span>
              )}
            </footer>
          </article>
        </div>
      </div>
    </SlideRightTransition>
  );
}
