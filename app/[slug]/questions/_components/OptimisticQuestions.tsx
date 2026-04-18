'use client';

import { useOptimistic, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addQuestion } from '@/data/actions/question';
import { usePolling } from '@/lib/usePolling';
import type { Question } from '@/types';
import { QuestionCard } from './QuestionCard';

type Props = {
  eventSlug: string;
  currentUser: string | null;
  questionCount: number;
  sort: React.ReactNode;
  children: React.ReactNode;
};

export function OptimisticQuestions({ eventSlug, currentUser, questionCount, sort, children }: Props) {
  usePolling(5000);

  const formRef = useRef<HTMLFormElement>(null);
  const [pendingQuestions, setPendingQuestions] = useOptimistic<Question[]>([]);

  async function submitAction(formData: FormData) {
    const content = (formData.get('content') as string)?.trim();
    if (!content) return;
    formRef.current?.reset();

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
    const serverData = new FormData();
    serverData.set('content', content);
    serverData.set('id', id);
    const result = await addQuestion(eventSlug, serverData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  const totalCount = questionCount + pendingQuestions.length;

  return (
    <>
      <div className="bg-background sticky top-[env(safe-area-inset-top)] z-10 space-y-3 pt-5 pb-3">
        <form ref={formRef} action={submitAction} className="flex gap-2">
          <Input name="content" placeholder="Ask a question..." required className="flex-1" />
          <Button type="submit">Ask</Button>
        </form>
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
