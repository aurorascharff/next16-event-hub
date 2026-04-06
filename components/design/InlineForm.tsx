'use client';

import { useOptimistic, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  placeholder: string;
  submitLabel: string;
  disabled?: boolean;
  resetOnSubmit?: boolean;
};

export function InlineForm({ action, placeholder, submitLabel, disabled, resetOnSubmit = true }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useOptimistic(false);

  return (
    <form ref={formRef} action={async (formData: FormData) => {
      setIsPending(true);
      if (resetOnSubmit) {
        formRef.current?.reset();
      }
      await action(formData);
    }} className="flex gap-2">
      <Input
        name="content"
        placeholder={placeholder}
        required
        className="flex-1"
      />
      <Button type="submit" disabled={isPending || disabled}>
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            {submitLabel}
            <Spinner />
          </span>
        ) : submitLabel}
      </Button>
    </form>
  );
}
