'use client';

import { SendHorizontal } from 'lucide-react';
import { startTransition, useOptimistic, useRef } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { addQuestion } from '@/features/question/question-actions';
import { QuestionCard } from '@/features/question/components/question-list';
import type { Question } from '@/types/question';

type Props = {
  eventSlug: string;
};

export function QuestionForm({ eventSlug }: Props) {
  async function submitAction(formData: FormData) {
    const content = (formData.get('content') as string)?.trim();
    if (!content) return;
    const serverData = new FormData();
    serverData.set('content', content);
    const result = await addQuestion(eventSlug, serverData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  return (
    <FormShell>
      <form action={submitAction} className="mx-auto flex max-w-2xl gap-2">
        <Input name="content" placeholder="Ask a question..." required className="flex-1" />
        <SubmitIcon label="Send question" />
      </form>
    </FormShell>
  );
}

export function OptimisticQuestionForm({ eventSlug }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticQuestions, setOptimisticQuestionForm] = useOptimistic<Question[]>([]);

  function handleSubmit(e: React.ChangeEvent) {
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
      userName: 'You',
      votes: 0,
    };

    startTransition(async () => {
      setOptimisticQuestionForm(c => {
        return [newQuestion, ...c];
      });
      const serverData = new FormData();
      serverData.set('content', content);
      serverData.set('id', id);
      const result = await addQuestion(eventSlug, serverData);
      if (!result.success) {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      {optimisticQuestions.map(question => {
        return <QuestionCard key={question.id} question={question} pending />;
      })}
      <FormShell>
        <form ref={formRef} onSubmit={handleSubmit} className="mx-auto flex max-w-2xl gap-2">
          <Input name="content" placeholder="Ask a question..." required className="flex-1" />
          <SubmitIcon label="Send question" />
        </form>
      </FormShell>
    </>
  );
}

function FormShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ viewTransitionName: 'question-form' }}
      className="bg-background border-border/40 fixed inset-x-0 bottom-0 z-30 border-t px-4 pt-2 pb-[calc(4.5rem+env(safe-area-inset-bottom))]"
    >
      {children}
    </div>
  );
}

function SubmitIcon({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="text-primary hover:text-primary/80 flex shrink-0 items-center justify-center rounded-md px-2 transition-colors"
      aria-label={label}
    >
      <SendHorizontal className="size-5" />
    </button>
  );
}
