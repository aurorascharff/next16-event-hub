import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const NEIGHBORHOODS = [
  'South Beach',
  'Wynwood',
  'Little Havana',
  'Brickell',
  'Downtown',
  'Coconut Grove',
  'Design District',
  'Coral Gables',
] as const;

export const CATEGORIES = [
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Bar', value: 'bar' },
  { label: 'Beach', value: 'beach' },
  { label: 'Art', value: 'art' },
  { label: 'Nightlife', value: 'nightlife' },
  { label: 'Café', value: 'cafe' },
] as const;

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find(c => {return c.value === value})?.label ?? value;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    art: 'bg-purple-500/15 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400',
    bar: 'bg-amber-500/15 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400',
    beach: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400',
    cafe: 'bg-orange-500/15 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400',
    nightlife: 'bg-pink-500/15 text-pink-600 border-pink-500/20 dark:bg-pink-500/20 dark:text-pink-400',
    restaurant: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400',
  };
  return colors[category] ?? 'bg-muted text-muted-foreground';
}

export async function slow(delay: number = 700) {
  await new Promise(resolve => {
    return setTimeout(resolve, delay);
  });
}
