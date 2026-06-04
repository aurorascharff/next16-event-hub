'use client';

import { useOptimistic } from 'react';
import type { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Spinner } from '../ui/spinner';
import type { VariantProps } from 'class-variance-authority';

type Props = Omit<React.ComponentProps<'button'>, 'formAction'> &
  VariantProps<typeof buttonVariants> & {
    action: (formData: FormData) => void | Promise<void>;
    onSubmit?: (formData: FormData) => void;
  };

export function SubmitButton({ children, action, onSubmit, disabled, ...props }: Props) {
  const [isPending, setIsPending] = useOptimistic(false);

  async function submitAction(formData: FormData) {
    onSubmit?.(formData);
    setIsPending(true);
    await action(formData);
  }

  return (
    <Button type="submit" formAction={submitAction} disabled={isPending || disabled} {...props}>
      {isPending ? (
        <span className="flex items-center justify-center gap-2">
          {children}
          <Spinner />
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
