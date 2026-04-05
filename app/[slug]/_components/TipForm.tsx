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
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Input
          name="author"
          placeholder="Your name"
          required
          className="w-32 shrink-0"
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
          <p className="text-sm text-red-500">{state.error}</p>
        )}
        <SubmitButton size="sm" className="ml-auto">
          Add tip
        </SubmitButton>
      </div>
    </form>
  );
}
