'use client';

import { use, ViewTransition } from 'react';
import useSWR from 'swr';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';

type Comment = {
  id: string;
  content: string;
  userName: string;
  likes: number;
  eventSlug: string;
  createdAt: Date | string;
};

const fetcher = (url: string) => {return fetch(url).then(res => {return res.json()})};

type Props = {
  commentsPromise: Promise<Comment[]>;
  eventSlug: string;
  currentUser: string | null;
};

export function CommentFeed({ commentsPromise, eventSlug, currentUser }: Props) {
  const initialComments = use(commentsPromise);

  const { data: comments } = useSWR<Comment[]>(
    `/api/events/${eventSlug}/comments`,
    fetcher,
    { fallbackData: initialComments, refreshInterval: 3000 },
  );

  return (
    <div className="space-y-3">
      <CommentForm eventSlug={eventSlug} />
      <div className="space-y-2">
        {(comments ?? []).map(comment => {
          return (
            <ViewTransition key={comment.id} name={`comment-${comment.id}`} enter="slide-up">
              <CommentCard comment={comment} currentUser={currentUser} />
            </ViewTransition>
          );
        })}
        {(comments ?? []).length === 0 && (
          <p className="text-muted-foreground py-6 text-center text-xs">
            No comments yet. Start the conversation!
          </p>
        )}
      </div>
    </div>
  );
}
