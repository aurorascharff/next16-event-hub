'use server';

import { refresh, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { canManageSpots } from '@/data/queries/auth';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

const PROTECT_SEED_SPOTS = true;

async function checkSeedSpotProtection(slug: string, action: string): Promise<ActionResult | null> {
  if (!PROTECT_SEED_SPOTS) return null;
  const spot = await prisma.spot.findUnique({ where: { slug } });
  if (spot?.seed) {
    return { error: `Seed spots cannot be ${action}`, success: false };
  }
  return null;
}

const NEIGHBORHOODS = [
  'South Beach',
  'Wynwood',
  'Little Havana',
  'Brickell',
  'Downtown',
  'Coconut Grove',
  'Design District',
  'Coral Gables',
] as const;

const CATEGORIES = ['restaurant', 'bar', 'beach', 'art', 'nightlife', 'cafe'] as const;

const spotSchema = z.object({
  category: z.enum(CATEGORIES, { message: 'Category is required' }),
  content: z.string().min(1, 'Content is required'),
  description: z.string().min(1, 'Description is required'),
  name: z.string().min(1, 'Name is required'),
  neighborhood: z.enum(NEIGHBORHOODS, { message: 'Neighborhood is required' }),
  published: z.boolean(),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export type ActionResult =
  | { success: true }
  | {
      success: false;
      error: string;
      formData?: {
        name: string;
        description: string;
        content: string;
        neighborhood: string;
        category: string;
        published: boolean;
      };
    };

export async function createSpot(formData: FormData): Promise<ActionResult> {
  if (!canManageSpots()) {
    return { error: 'Unauthorized', success: false };
  }

  const rawData = {
    category: (formData.get('category') as string) || '',
    content: (formData.get('content') as string) || '',
    description: (formData.get('description') as string) || '',
    name: (formData.get('name') as string) || '',
    neighborhood: (formData.get('neighborhood') as string) || '',
    published: formData.get('published') === 'on',
  };

  const result = spotSchema.safeParse(rawData);

  if (!result.success) {
    return { error: result.error.issues[0].message, formData: rawData, success: false };
  }

  const { name, description, content, neighborhood, category, published } = result.data;

  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.spot.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  await slow();
  await prisma.spot.create({
    data: { category, content, description, name, neighborhood, published, slug },
  });

  revalidateTag('spots', 'max');
  refresh();
  return { success: true };
}

export async function updateSpot(slug: string, formData: FormData): Promise<ActionResult> {
  if (!canManageSpots()) {
    return { error: 'Unauthorized', success: false };
  }

  const seedError = await checkSeedSpotProtection(slug, 'edited');
  if (seedError) return seedError;

  const rawData = {
    category: (formData.get('category') as string) || '',
    content: (formData.get('content') as string) || '',
    description: (formData.get('description') as string) || '',
    name: (formData.get('name') as string) || '',
    neighborhood: (formData.get('neighborhood') as string) || '',
    published: formData.get('published') === 'on',
  };

  const result = spotSchema.safeParse(rawData);

  if (!result.success) {
    return { error: result.error.issues[0].message, formData: rawData, success: false };
  }

  const { name, description, content, neighborhood, category, published } = result.data;

  await slow();
  await prisma.spot.update({
    data: { category, content, description, name, neighborhood, published },
    where: { slug },
  });

  revalidateTag('spots', 'max');
  revalidateTag(`spot-${slug}`, 'max');
  refresh();
  return { success: true };
}

export async function deleteSpot(slug: string): Promise<ActionResult> {
  if (!canManageSpots()) {
    return { error: 'Unauthorized', success: false };
  }

  const seedError = await checkSeedSpotProtection(slug, 'deleted');
  if (seedError) return seedError;

  await slow();
  await prisma.spot.delete({
    where: { slug },
  });

  revalidateTag('spots', 'max');
  revalidateTag(`spot-${slug}`, 'max');
  refresh();
  return { success: true };
}

export async function toggleArchiveSpot(slug: string, archived: boolean): Promise<ActionResult> {
  if (!canManageSpots()) {
    return { error: 'Unauthorized', success: false };
  }

  await slow();
  await prisma.spot.update({
    data: { archived },
    where: { slug },
  });

  revalidateTag('spots', 'max');
  revalidateTag(`spot-${slug}`, 'max');
  refresh();
  return { success: true };
}

export async function toggleFeatureSpot(slug: string, featured: boolean): Promise<ActionResult> {
  if (!canManageSpots()) {
    return { error: 'Unauthorized', success: false };
  }

  await slow();
  await prisma.spot.update({
    data: { featured },
    where: { slug },
  });

  revalidateTag('spots', 'max');
  revalidateTag(`spot-${slug}`, 'max');
  refresh();
  return { success: true };
}
