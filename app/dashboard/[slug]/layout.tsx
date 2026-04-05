import { ViewTransition } from 'react';
import { getSpots } from '@/data/queries/spot';

export async function generateStaticParams() {
  const spots = await getSpots();
  return spots.map(spot => {
    return { slug: spot.slug };
  });
}

export default async function SpotLayout({ children, params }: LayoutProps<'/dashboard/[slug]'>) {
  const { slug } = await params;

  return (
    <div>
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <ViewTransition name={`spot-card-${slug}`} share="morph" default="none">
            <article>{children}</article>
          </ViewTransition>
        </div>
      </div>
    </div>
  );
}
