import { EventDetailsSkeleton } from './_components/EventDetails';
import { Skeleton } from '@/components/ui/skeleton';

export default function SessionLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="min-h-56 sm:min-h-72">
        <EventDetailsSkeleton />
        <div className="mt-4 min-h-9">
          <div className="flex min-h-9 gap-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 w-14 shrink-0 rounded-md" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
            <Skeleton className="size-7 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
