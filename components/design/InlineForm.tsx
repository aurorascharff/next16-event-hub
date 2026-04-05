'use client';

import { useRef } from 'react';
import { SubmitButton } from '@/components/design/SubmitButton';
import { Input } from '@/components/ui/input';

type Props = {
  action: (formData: FormData) => void;
  placeholder: string;
  submitLabel: string;
  disabled?: boolean;
  resetOnSubmit?: boolean;
};

export function InlineForm({ action, placeholder, submitLabel, disabled, resetOnSubmit = true }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleAction(formData: FormData) {
    action(formData);
    if (resetOnSubmit) {
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleAction} className="flex gap-2">
      <Input
        name="content"
        placeholder={placeholder}
        required
        className="flex-1"
      />
      <SubmitButton size="sm" disabled={disabled}>{submitLabel}</SubmitButton>
    </form>
  );
}
