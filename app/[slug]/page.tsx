import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getEventBySlug } from '@/data/queries/event';

export default function SessionPage({ params }: PageProps<'/[slug]'>) {
  return (
    <Suspense
      fallback={
        <ViewTransition exit="slide-down">
          <DescriptionSkeleton />
        </ViewTransition>
      }
    >
      <ViewTransition enter="slide-up" default="none">
        <EventDescription params={params} />
      </ViewTransition>
    </Suspense>
  );
}

async function EventDescription({ params }: Pick<PageProps<'/[slug]'>, 'params'>) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return (
    <p className="text-muted-foreground -mt-4 text-xs leading-relaxed sm:text-sm">
      {event.description}
    </p>
  );
}

function DescriptionSkeleton() {
  return (
    <div className="-mt-4 space-y-1.5">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}
