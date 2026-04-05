'use server';

import { refresh, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

const tipSchema = z.object({
  author: z.string().min(1, 'Name is required').max(50),
  content: z.string().min(1, 'Tip is required').max(500),
});

export type TipActionResult =
  | { success: true }
  | { success: false; error: string };

export async function addTip(spotSlug: string, formData: FormData): Promise<TipActionResult> {
  const rawData = {
    author: (formData.get('author') as string) || '',
    content: (formData.get('content') as string) || '',
  };

  const result = tipSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
  }

  await slow();
  await prisma.tip.create({
    data: {
      author: result.data.author,
      content: result.data.content,
      spotSlug,
    },
  });

  revalidateTag(`spot-${spotSlug}`, 'max');
  refresh();
  return { success: true };
}

export async function deleteTip(tipId: string, spotSlug: string): Promise<TipActionResult> {
  await slow();
  await prisma.tip.delete({
    where: { id: tipId },
  });

  revalidateTag(`spot-${spotSlug}`, 'max');
  refresh();
  return { success: true };
}
