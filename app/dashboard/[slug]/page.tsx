import { Calendar, Clock, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { BackButton } from '@/components/BackButton';
import { MarkdownContent } from '@/components/Markdown';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getSpotBySlug } from '@/data/queries/spot';
import { cn, formatDate, getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { DeleteSpotButton } from './_components/DeleteSpotButton';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const spot = await getSpotBySlug(slug);

  return {
    description: spot.description || undefined,
    title: spot.name,
  };
}

export default async function SpotPage({ params }: PageProps<'/dashboard/[slug]'>) {
  const { slug } = await params;

  return (
    <>
      <div className="mb-6">
        <BackButton href="/dashboard" />
      </div>
      <Suspense
        fallback={
          <ViewTransition exit="slide-down">
            <SpotHeaderSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" exit="slide-down" default="none">
          <SpotHeader slug={slug} />
        </ViewTransition>
      </Suspense>
      <Separator className="my-6" />
      <Suspense
        fallback={
          <ViewTransition exit="slide-down">
            <SpotContentSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" exit="slide-down" default="none">
          <SpotContent slug={slug} />
        </ViewTransition>
      </Suspense>
    </>
  );
}

async function SpotHeader({ slug }: { slug: string }) {
  const spot = await getSpotBySlug(slug);
  const wasUpdated = spot.updatedAt > spot.createdAt;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">{spot.name}</h1>
          {spot.featured && <Star className="size-4 fill-amber-500 text-amber-500" />}
        </div>
        {spot.description && <p className="text-muted-foreground">{spot.description}</p>}
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span
            className={cn(
              'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
              getCategoryColor(spot.category),
            )}
          >
            {getCategoryLabel(spot.category)}
          </span>
          <span
            className={cn(
              'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
              spot.published
                ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20'
                : 'bg-muted text-muted-foreground border-border',
            )}
          >
            {spot.published ? 'Published' : 'Draft'}
          </span>
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
        </div>
      </div>
      <div className="flex gap-2">
        <Link href={`/dashboard/${spot.slug}/edit`} className={buttonVariants({ variant: 'outline' })}>
          Edit
        </Link>
        <DeleteSpotButton slug={spot.slug} />
      </div>
    </div>
  );
}

async function SpotContent({ slug }: { slug: string }) {
  const spot = await getSpotBySlug(slug);

  return <MarkdownContent>{spot.content}</MarkdownContent>;
}

export function SpotHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="w-full space-y-4 sm:w-auto sm:space-y-2">
        <Skeleton className="h-10 w-48 sm:h-8 sm:w-64" />
        <Skeleton className="h-8 w-full sm:h-6 sm:w-96" />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-y-1">
          <Skeleton className="h-7 w-20 sm:h-4" />
          <Skeleton className="h-7 w-28 sm:h-4" />
          <Skeleton className="h-7 w-20 sm:h-4" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-14 sm:h-10" />
        <Skeleton className="h-10 w-18 sm:h-10" />
      </div>
    </div>
  );
}

export function SpotContentSkeleton() {
  return <Skeleton className="h-64 w-full" />;
}
