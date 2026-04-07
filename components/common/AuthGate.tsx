'use client';

import { use } from 'react';
import { SubmitButton } from '@/components/design/SubmitButton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { setUserName } from '@/data/actions/auth';

type Props = {
  userPromise: Promise<string | null>;
};

export function AuthGate({ userPromise }: Props) {
  const userName = use(userPromise);
  if (userName) return null;

  return (
    <Dialog open modal>
      <DialogContent showCloseButton={false} style={{ viewTransitionName: 'auth-gate' }}>
        <DialogHeader>
          <DialogTitle className="font-sans text-lg font-bold">Welcome to Event Hub</DialogTitle>
          <DialogDescription>Pick a display name to join the conversation.</DialogDescription>
        </DialogHeader>
        <form className="flex gap-2">
          <Input name="name" placeholder="Your name" required maxLength={30} autoFocus className="flex-1" />
          <SubmitButton action={setUserName} size="sm">
            Join
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
