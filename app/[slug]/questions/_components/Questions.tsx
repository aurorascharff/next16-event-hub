'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addQuestion } from '@/data/actions/question';

type Props = {
  eventSlug: string;
  currentUser: string | null;
  questionCount: number;
  sort: React.ReactNode;
  children: React.ReactNode;
};

export function Questions({ eventSlug, questionCount, sort, children }: Props) {
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
    <>
      <div className="bg-background sticky top-[env(safe-area-inset-top)] z-10 space-y-3 pt-5 pb-3">
        <form action={submitAction} className="flex gap-2">
          <Input name="content" placeholder="Ask a question..." required className="flex-1" />
          <Button type="submit">Ask</Button>
        </form>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
            {questionCount} question{questionCount !== 1 ? 's' : ''}
          </span>
          {sort}
        </div>
      </div>
      <div className="space-y-2">{children}</div>
    </>
  );
}
