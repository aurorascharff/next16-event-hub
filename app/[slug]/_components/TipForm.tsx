'use client';

import { useActionState } from 'react';
import { useRef } from 'react';
import { SubmitButton } from '@/components/design/SubmitButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addTip, type TipActionResult } from '@/data/actions/tip';

type Props = {
  spotSlug: string;
};

export function TipForm({ spotSlug }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  async function submitAction(_prev: TipActionResult | null, formData: FormData) {
    const result = await addTip(spotSlug, formData);
    if (result.success) {
      formRef.current?.reset();
    }
    return result;
  }

  const [state, action] = useActionState(submitAction, null);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2.5">
        <Input
          name="author"
          placeholder="Your name"
          required
          className="sm:w-32 sm:shrink-0"
        />
        <Textarea
          name="content"
          placeholder="Share a tip..."
          required
          rows={1}
          className="min-h-[38px] resize-none"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        {state && !state.success && (
          <p className="text-destructive text-xs">{state.error}</p>
        )}
        <SubmitButton size="sm" className="ml-auto">
          Add tip
        </SubmitButton>
      </div>
    </form>
  );
}
