import { Suspense } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { CenteredSpinner } from '@/components/ui/spinner';
import { getCurrentUser } from '@/data/queries/auth';
import { getCommentsByEvent } from '@/data/queries/comment';
import { getEventBySlug, getEvents } from '@/data/queries/event';
import { CommentCard } from './_components/CommentCard';
import { CommentForm } from './_components/CommentForm';
import { EventDetails } from './_components/EventDetails';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    description: event.description,
    title: `${event.name} | Event Hub`,
  };
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map(event => {
    return {
      slug: event.slug,
    };
  });
}

export default async function SessionPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Suspense>
          <EventDetails slug={slug} />
        </Suspense>
        <div className="mt-4 min-h-9">
          <CommentForm />
        </div>
      </div>
      <Suspense fallback={<CenteredSpinner />}>
        <CommentList slug={slug} />
      </Suspense>
    </div>
  );
}

async function CommentList({ slug }: { slug: string }) {
  const currentUser = await getCurrentUser();
  const comments = await getCommentsByEvent(slug, currentUser);

  return (
    <div className="space-y-2">
      {comments.map(comment => {
        return <CommentCard key={comment.id} comment={comment} currentUser={currentUser} />;
      })}
      {comments.length === 0 && <EmptyState message="No comments yet. Start the conversation!" />}
    </div>
  );
}
