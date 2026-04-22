'use client';

import { SendHorizontal } from 'lucide-react';
import { useOptimistic, useRef } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { addQuestion } from '@/data/actions/question';
import { usePolling } from '@/lib/usePolling';
import type { Question } from '@/types';
import { QuestionCard } from './QuestionCard';

type Props = {
  eventSlug: string;
  currentUser: string | null;
};

export function OptimisticQuestions({ eventSlug, currentUser }: Props) {
  usePolling(5000);

  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticQuestions, setOptimisticQuestions] = useOptimistic<Question[]>([]);

  async function handleSubmit(e: React.ChangeEvent) {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
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

    setOptimisticQuestions(c => {
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

  return (
    <>
      {optimisticQuestions.map(question => {
        return <QuestionCard key={question.id} question={question} pending />;
      })}
      <div
        style={{ viewTransitionName: 'question-form' }}
        className="bg-background border-border/40 fixed inset-x-0 bottom-0 z-30 border-t px-4 pt-2 pb-[calc(4.5rem+env(safe-area-inset-bottom))]"
      >
        <form ref={formRef} onSubmit={handleSubmit} className="mx-auto flex max-w-2xl gap-2">
          <Input name="content" placeholder="Ask a question..." required className="flex-1" />
          <button
            type="submit"
            className="text-primary hover:text-primary/80 flex shrink-0 items-center justify-center rounded-md px-2 transition-colors"
            aria-label="Send question"
          >
            <SendHorizontal className="size-5" />
          </button>
        </form>
      </div>
    </>
  );
}
