import { Suspense, ViewTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { updateSpot } from '@/data/actions/spot';
import { getSpotBySlug } from '@/data/queries/spot';
import { SpotForm } from '../../_components/SpotForm';

export default async function EditSpotPage({ params }: PageProps<'/dashboard/[slug]/edit'>) {
  const { slug } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Spot</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <ViewTransition exit="slide-down">
              <EditSpotContentSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up" exit="slide-down" default="none">
            <EditSpotContent slug={slug} />
          </ViewTransition>
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function EditSpotContent({ slug }: { slug: string }) {
  const spot = await getSpotBySlug(slug);

  return (
    <SpotForm
      key={`${spot.slug}-${spot.updatedAt.getTime()}`}
      action={updateSpot.bind(null, spot.slug)}
      defaultValues={{
        category: spot.category,
        content: spot.content,
        description: spot.description,
        name: spot.name,
        neighborhood: spot.neighborhood,
        published: spot.published,
      }}
      submitLabel="Save Changes"
      successMessage="Spot updated successfully"
      redirectTo={`/dashboard/${spot.slug}`}
      cancelHref={`/dashboard/${spot.slug}`}
    />
  );
}

export function EditSpotContentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}
