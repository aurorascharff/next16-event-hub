import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { SlideLeftTransition } from '@/components/ui/animations';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { canManageSpots } from '@/data/queries/auth';
import { getPublishedSpots } from '@/data/queries/spot';
import { cn, formatDate, getCategoryColor, getCategoryLabel } from '@/lib/utils';

export default function HomePage() {
  const showDashboard = canManageSpots();

  return (
    <SlideLeftTransition>
      <div className="min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Miami Spots</h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Your curated guide to the best of Miami
              </p>
            </div>
            <div className="flex items-center gap-2">
              {showDashboard && (
                <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <SpotList />
        </div>
      </div>
    </SlideLeftTransition>
  );
}

async function SpotList() {
  const spots = await getPublishedSpots();

  if (spots.length === 0) {
    return (
      <Card className="py-16 text-center">
        <CardContent>
          <p className="text-muted-foreground text-lg">No spots yet. Check back soon!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {spots.map(spot => {
        return (
          <Link key={spot.slug} href={`/${spot.slug}`} className="block">
            <Card className="hover:bg-muted/50 transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{spot.name}</CardTitle>
                      {spot.featured && <Star className="text-amber-500 size-4 fill-current" />}
                    </div>
                    <CardDescription className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {spot.neighborhood}
                      </span>
                      <span>{formatDate(spot.createdAt)}</span>
                    </CardDescription>
                  </div>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                      getCategoryColor(spot.category),
                    )}
                  >
                    {getCategoryLabel(spot.category)}
                  </span>
                </div>
              </CardHeader>
              {spot.description && (
                <CardContent className="pt-0">
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed">{spot.description}</p>
                </CardContent>
              )}
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
