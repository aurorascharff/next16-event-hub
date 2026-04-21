'use client';

import { SendHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { addQuestion } from '@/data/actions/question';

type Props = {
  eventSlug: string;
  currentUser: string | null;
};

export function Questions({ eventSlug }: Props) {
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
    <div className="bg-background fixed inset-x-0 bottom-0 z-30 px-4 pt-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
      <form action={submitAction} className="mx-auto flex max-w-2xl gap-2">
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
  );
}
