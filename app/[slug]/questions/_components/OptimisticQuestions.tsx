'use client';

import { useOptimistic } from 'react';
import { toast } from 'sonner';
import { addQuestion } from '@/data/actions/question';
import { usePolling } from '@/lib/usePolling';
import type { Question } from '@/types';
import { QuestionCard } from './QuestionCard';
import { QuestionForm } from './QuestionForm';

type Props = {
  eventSlug: string;
  currentUser: string | null;
  questionCount: number;
  sort: React.ReactNode;
  children: React.ReactNode;
};

export function OptimisticQuestions({ eventSlug, currentUser, questionCount, sort, children }: Props) {
  usePolling(5000);

  const [pendingQuestions, setPendingQuestions] = useOptimistic<Question[]>([]);

  async function postAction(content: string) {
    const id = crypto.randomUUID();
    const newQuestion: Question = {
      content,
      createdAt: new Date(),
      eventSlug,
      hasVoted: false,
      id,
      userName: currentUser ?? 'You',
      votes: 0,
    };

    setPendingQuestions(c => {
      return [newQuestion, ...c];
    });
    const formData = new FormData();
    formData.set('content', content);
    formData.set('id', id);
    const result = await addQuestion(eventSlug, formData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  const totalCount = questionCount + pendingQuestions.length;

  return (
    <>
      <div className="bg-background sticky top-[env(safe-area-inset-top)] z-10 space-y-3 pt-5 pb-3">
        <QuestionForm postAction={postAction} />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live · {totalCount} question{totalCount !== 1 ? 's' : ''}
          </span>
          {sort}
        </div>
      </div>
      <div className="space-y-2">
        {pendingQuestions.map(question => {
          return <QuestionCard key={question.id} question={question} pending />;
        })}
        {children}
      </div>
    </>
  );
}
