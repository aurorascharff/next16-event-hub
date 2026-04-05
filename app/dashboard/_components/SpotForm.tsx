'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/design/SubmitButton';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ActionResult } from '@/data/actions/spot';
import { CATEGORIES, NEIGHBORHOODS } from '@/lib/utils';
import type { Route } from 'next';

type FormValues = {
  name: string;
  description: string;
  content: string;
  neighborhood: string;
  category: string;
  published: boolean;
};

type Props<T extends string> = {
  action: (formData: FormData) => Promise<ActionResult>;
  defaultValues: FormValues;
  submitLabel: string;
  successMessage: string;
  redirectTo: Route<T>;
  cancelHref: Route<T>;
};

export function SpotForm<T extends string>({
  action,
  defaultValues,
  submitLabel,
  successMessage,
  redirectTo,
  cancelHref,
}: Props<T>) {
  const router = useRouter();

  const [state, formAction] = useActionState(async (prevState: FormValues, formData: FormData) => {
    const result = await action(formData);
    if (result.success) {
      toast.success(successMessage);
      router.push(redirectTo);
      return prevState;
    } else {
      toast.error(result.error);
      return result.formData ?? prevState;
    }
  }, defaultValues);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={state.name} placeholder="e.g. Joe's Stone Crab" required className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={state.description}
          placeholder="A brief description of the spot..."
          required
          rows={2}
          className="resize-none"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <select
            id="neighborhood"
            name="neighborhood"
            defaultValue={state.neighborhood}
            required
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <option value="">Select neighborhood</option>
            {NEIGHBORHOODS.map(n => {return (
              <option key={n} value={n}>
                {n}
              </option>
            )})}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={state.category}
            required
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <option value="">Select category</option>
            {CATEGORIES.map(c => {return (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            )})}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="content">Content</Label>
          <span className="text-muted-foreground text-xs">Markdown supported</span>
        </div>
        <Textarea
          id="content"
          name="content"
          defaultValue={state.content}
          placeholder="Write about this spot using **markdown**..."
          required
          rows={12}
          className="resize-y font-mono text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={state.published}
          className="border-input accent-primary size-4 rounded"
        />
        <Label htmlFor="published" className="cursor-pointer">
          Published
        </Label>
      </div>
      <div className="flex gap-3 pt-2">
        <SubmitButton size="lg">{submitLabel}</SubmitButton>
        <Link href={cancelHref} className={buttonVariants({ size: 'lg', variant: 'outline' })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
