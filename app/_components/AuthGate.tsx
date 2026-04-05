'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/components/design/SubmitButton';
import { Input } from '@/components/ui/input';
import { setUserName } from '@/data/actions/auth';

export function AuthGate() {
  const [, action] = useActionState(
    async (_prev: null, formData: FormData) => {
      await setUserName(formData);
      return null;
    },
    null,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card mx-4 w-full max-w-sm rounded-lg border p-6">
        <h2 className="font-sans text-lg font-bold">Welcome to Event Hub</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Pick a display name to join the conversation.
        </p>
        <form action={action} className="mt-4 flex gap-2">
          <Input
            name="name"
            placeholder="Your name"
            required
            maxLength={30}
            autoFocus
            className="flex-1"
          />
          <SubmitButton size="sm">Join</SubmitButton>
        </form>
      </div>
    </div>
  );
}
