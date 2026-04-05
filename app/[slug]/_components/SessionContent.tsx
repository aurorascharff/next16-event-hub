'use client';

import { useOptimistic, useTransition } from 'react';
import { CommentFeed } from './CommentFeed';
import { QuestionFeed } from './QuestionFeed';
import { SessionTabs } from './SessionTabs';

type Comment = {
  id: string;
  content: string;
  userName: string;
  likes: number;
  eventSlug: string;
  createdAt: Date | string;
};

type Question = {
  id: string;
  content: string;
  userName: string;
  votes: number;
  eventSlug: string;
  createdAt: Date | string;
};

type TabValue = 'comments' | 'questions';

type Props = {
  commentsPromise: Promise<Comment[]>;
  questionsPromise: Promise<Question[]>;
  eventSlug: string;
  currentUser: string | null;
};

export function SessionContent({ commentsPromise, questionsPromise, eventSlug, currentUser }: Props) {
  const [optimisticTab, setOptimisticTab] = useOptimistic<TabValue>('comments');
  const [, startTransition] = useTransition();

  function handleTabChange(tab: TabValue) {
    startTransition(() => {
      setOptimisticTab(tab);
    });
  }

  return (
    <div>
      <SessionTabs activeTab={optimisticTab} onTabChange={handleTabChange} />
      <div className="pt-4">
        {optimisticTab === 'comments' ? (
          <CommentFeed
            commentsPromise={commentsPromise}
            eventSlug={eventSlug}
            currentUser={currentUser}
          />
        ) : (
          <QuestionFeed
            questionsPromise={questionsPromise}
            eventSlug={eventSlug}
          />
        )}
      </div>
    </div>
  );
}
